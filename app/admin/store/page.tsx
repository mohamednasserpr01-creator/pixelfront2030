// FILE: app/admin/store/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaStore, FaTruck, FaBox, FaPlus } from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Order, Product, ShippingStatus } from '../../../types';

// استدعاء المكونات اللي فصلناها
import OrdersStats from './components/OrdersStats';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import ProductsTable from './components/ProductsTable';
import ProductModal from './components/ProductModal';

// ==========================================
// 💡 MOCK DATA (سيتم استبدالها بـ API)
// ==========================================
const mockProducts: Product[] = [
    { id: 1, title: 'كتاب المراجعة النهائية', price: 249, stock: 100, category: 'books', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', status: 'متوفر' },
    { id: 2, title: 'أدوات هندسية', price: 103, stock: 30, category: 'tools', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500', status: 'متوفر' }
];

const mockOrders: Order[] = Array.from({ length: 45 }, (_, i) => ({
    id: `ORD-90${100 + i}`,
    studentName: `طالب تجريبي ${i + 1}`,
    phone: `010${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: 'الإسكندرية - سيدي بشر',
    items: [{ productId: 1, title: 'كتاب المراجعة النهائية', qty: 1, price: 249 }],
    totalPrice: 249,
    paymentStatus: i % 2 === 0 ? 'paid' : 'pending',
    shippingStatus: ['pending', 'processing', 'shipped', 'delivered', 'returned'][Math.floor(Math.random() * 5)] as ShippingStatus,
    inventoryUpdated: false,
    date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
    timeline: []
}));

export default function StoreDashboard() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
    
    // State للطلبات
    const [orders, setOrders] = useState<Order[]>([]);
    const [filters, setFilters] = useState({ search: '', status: 'all', dateFrom: '', dateTo: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // State للمنتجات
    const [products, setProducts] = useState<Product[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    useEffect(() => {
        setOrders(mockOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setProducts(mockProducts);
        setMounted(true);
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchSearch = filters.search === '' || o.id.includes(filters.search) || o.studentName.includes(filters.search) || o.phone.includes(filters.search);
            const matchStatus = filters.status === 'all' || o.shippingStatus === filters.status;
            const matchDateFrom = filters.dateFrom === '' || o.date >= filters.dateFrom;
            const matchDateTo = filters.dateTo === '' || o.date <= filters.dateTo;
            return matchSearch && matchStatus && matchDateFrom && matchDateTo;
        });
    }, [orders, filters]);

    // 💡 تم حل المشكلة هنا: فصلنا Side Effects عن الـ State Updater
    const handleUpdateOrderStatus = (orderId: string, newStatus: ShippingStatus) => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        // عمل نسخة من الأوردر عشان نعدل عليها بدون ما نأثر على الـ State الأصلية مباشرة
        const orderToUpdate = { ...orders[orderIndex] };

        // 1. التعامل مع المخزن والإشعارات أولاً
        if (newStatus === 'delivered' && !orderToUpdate.inventoryUpdated) {
            setProducts(prodPrev => {
                let updatedProds = [...prodPrev];
                orderToUpdate.items.forEach(item => {
                    const pIdx = updatedProds.findIndex(p => p.id === item.productId || p.title === item.title);
                    if (pIdx > -1) {
                        updatedProds[pIdx] = { ...updatedProds[pIdx], stock: Math.max(0, updatedProds[pIdx].stock - item.qty) };
                    }
                });
                return updatedProds;
            });
            orderToUpdate.inventoryUpdated = true;
            showToast('تم التوصيل وخصم المنتجات من المخزن أوتوماتيكياً! 📦✅', 'success');
        } 
        else if (orderToUpdate.inventoryUpdated && newStatus !== 'delivered') {
            setProducts(prodPrev => {
                let updatedProds = [...prodPrev];
                orderToUpdate.items.forEach(item => {
                    const pIdx = updatedProds.findIndex(p => p.id === item.productId || p.title === item.title);
                    if (pIdx > -1) {
                        updatedProds[pIdx] = { ...updatedProds[pIdx], stock: updatedProds[pIdx].stock + item.qty };
                    }
                });
                return updatedProds;
            });
            orderToUpdate.inventoryUpdated = false;
            showToast('تم استرجاع كمية المنتجات إلى المخزن.', 'info');
        } else {
            showToast('تم تحديث حالة الطلب بنجاح ✅', 'success');
        }

        // 2. تحديث بيانات الأوردر نفسه
        orderToUpdate.shippingStatus = newStatus;

        // 3. تحديث الـ State مرة واحدة بأمان
        const newOrders = [...orders];
        newOrders[orderIndex] = orderToUpdate;
        setOrders(newOrders);
        setSelectedOrder(orderToUpdate);
    };

    const handleSaveProduct = (productData: Partial<Product>) => {
        if (productToEdit) {
            setProducts(prev => prev.map(p => p.id === productToEdit.id ? { ...p, ...productData } as Product : p));
            showToast('تم تعديل المنتج بنجاح!', 'success');
        } else {
            setProducts(prev => [{ ...productData, id: Date.now() } as Product, ...prev]);
            showToast('تم إضافة المنتج للمتجر بنجاح!', 'success');
        }
        setIsProductModalOpen(false);
    };

    const handleExportExcel = () => {
        if (filteredOrders.length === 0) return;
        const excelData = filteredOrders.map((o, i) => ({
            'م': i + 1, 'رقم الطلب': o.id, 'العميل': o.studentName, 'الهاتف': o.phone, 'العنوان': o.address, 
            'الإجمالي': o.totalPrice, 'المنتجات': o.items.map(i => `${i.title} (x${i.qty})`).join(' + '), 'الحالة': o.shippingStatus
        }));
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, `Pixel_Orders.xlsx`);
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>{`
                .nav-tab { padding: 10px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
                .nav-tab.active { background: linear-gradient(45deg, var(--p-purple), #ff007f); color: white; box-shadow: 0 5px 15px rgba(108,92,231,0.3); }
                .nav-tab.inactive { background: var(--card); color: var(--txt-mut); border: 1px solid rgba(255,255,255,0.1); }
            `}</style>

            {/* ======== Header & Tabs ======== */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}><FaStore style={{ color: 'var(--p-purple)' }} /> إدارة المتجر والمخزن</h1>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={`nav-tab ${activeTab === 'orders' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('orders')}><FaTruck /> الطلبات والشحن</div>
                    <div className={`nav-tab ${activeTab === 'inventory' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('inventory')}><FaBox /> المخزن والمنتجات</div>
                </div>
            </div>

            {/* ======== Tab Content ======== */}
            {activeTab === 'orders' ? (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <OrdersStats orders={orders} />
                    <OrdersFilters onFilterChange={setFilters} onExport={handleExportExcel} />
                    <OrdersTable 
                        orders={filteredOrders.slice((currentPage - 1) * 15, currentPage * 15)} 
                        currentPage={currentPage} totalPages={Math.ceil(filteredOrders.length / 15)} 
                        onPageChange={setCurrentPage} 
                        onViewOrder={o => { setSelectedOrder(o); setIsOrderModalOpen(true); }} 
                    />
                    <OrderDetailsModal 
                        isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} 
                        order={selectedOrder} onUpdateStatus={handleUpdateOrderStatus} 
                    />
                </div>
            ) : (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button variant="primary" icon={<FaPlus />} onClick={() => { setProductToEdit(null); setIsProductModalOpen(true); }}>إضافة منتج</Button>
                    </div>
                    <ProductsTable products={products} onEditProduct={p => { setProductToEdit(p); setIsProductModalOpen(true); }} />
                    <ProductModal 
                        isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} 
                        onSave={handleSaveProduct} initialData={productToEdit} 
                    />
                </div>
            )}
        </div>
    );
}