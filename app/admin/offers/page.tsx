"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaGift, FaPlus, FaSearch, FaCheckCircle, 
    FaBan, FaClock, FaBarcode, FaFilter, FaCalendarAlt, FaUpload
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';
import styles from './Offers.module.css';

const generateMockOffers = () => [
    {
        id: 1, title: 'عرض بطل الثانوية', stage: 'الصف الثالث الثانوي', stream: 'علمي علوم',
        startDate: '2026-04-01', endDate: '2026-05-01', originalPrice: 1000, price: 600, 
        revenue: 205200, codesCount: 842, status: 'active',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500'
    }
];

export default function OffersListPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [offers, setOffers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // 💡 حالة الفورم تشمل المرحلة والصورة
    const [offerForm, setOfferForm] = useState({
        title: '', startDate: '', endDate: '', originalPrice: '', price: '', 
        stage: 'الصف الأول الثانوي', stream: 'عام', desc: '', image: ''
    });

    useEffect(() => {
        setOffers(generateMockOffers());
        setMounted(true);
    }, []);

    const filteredOffers = useMemo(() => {
        return offers.filter(o => {
            const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.stage.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
            const matchesDateFrom = dateFrom ? o.startDate >= dateFrom : true;
            const matchesDateTo = dateTo ? o.endDate <= dateTo : true;
            return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }, [offers, searchQuery, statusFilter, dateFrom, dateTo]);

    const activeOffers = offers.filter(o => o.status === 'active').length;
    const expiredOffers = offers.filter(o => o.status === 'expired').length;
    const upcomingOffers = offers.filter(o => o.status === 'upcoming').length;
    const totalCodesCount = offers.reduce((sum, o) => sum + o.codesCount, 0);

    // 💡 دالة رفع الصورة
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setOfferForm({...offerForm, image: event.target?.result as string});
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddOffer = () => {
        if (!offerForm.title || !offerForm.price || !offerForm.startDate || !offerForm.endDate) {
            showToast('يرجى إكمال البيانات الأساسية للعرض!', 'error');
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        let status = 'active';
        if (offerForm.endDate < today) status = 'expired';
        else if (offerForm.startDate > today) status = 'upcoming';

        const newOffer = {
            ...offerForm,
            id: Date.now(),
            status,
            revenue: 0,
            codesCount: 0,
            // وضع صورة افتراضية لو المستخدم لم يرفع صورة
            image: offerForm.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500'
        };

        setOffers([newOffer, ...offers]);
        setIsAddModalOpen(false);
        showToast('تم إضافة العرض بنجاح! 🎉', 'success');
        setOfferForm({ title: '', startDate: '', endDate: '', originalPrice: '', price: '', stage: 'الصف الأول الثانوي', stream: 'عام', desc: '', image: '' });
    };

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}><FaGift style={{ color: 'var(--p-purple)' }} /> إدارة العروض والمبيعات</h1>
                    <p className={styles.pageSubtitle}>أضف وتتبع العروض الخاصة بالمنصة بكل سهولة.</p>
                </div>
                
                {/* 🚀 الزرارين: زر إضافة العرض وزر السجل المركزي للأكواد */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline" icon={<FaBarcode />} onClick={() => router.push('/admin/offers/all-codes')} style={{ color: 'var(--txt)', borderColor: 'rgba(255,255,255,0.2)' }}>
                        السجل المركزي للأكواد
                    </Button>
                    <Button variant="primary" icon={<FaPlus />} onClick={() => setIsAddModalOpen(true)} style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', border: 'none' }}>
                        إضافة عرض جديد
                    </Button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}><div className={styles.statIcon} style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)' }}><FaCheckCircle /></div><div><div className={styles.statLabel}>العروض المتاحة</div><div className={styles.statValue}>{activeOffers}</div></div></div>
                <div className={styles.statCard}><div className={styles.statIcon} style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--warning)' }}><FaClock /></div><div><div className={styles.statLabel}>العروض المجدولة</div><div className={styles.statValue}>{upcomingOffers}</div></div></div>
                <div className={styles.statCard}><div className={styles.statIcon} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)' }}><FaBan /></div><div><div className={styles.statLabel}>العروض المنتهية</div><div className={styles.statValue}>{expiredOffers}</div></div></div>
                <div className={styles.statCard}><div className={styles.statIcon} style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)' }}><FaBarcode /></div><div><div className={styles.statLabel}>إجمالي الأكواد</div><div className={styles.statValue}>{totalCodesCount.toLocaleString()}</div></div></div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.filterGroup} style={{ flex: '1 1 250px' }}>
                    <FaSearch color="var(--p-purple)" />
                    <input type="text" placeholder="بحث باسم العرض أو المرحلة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.filterInput} />
                </div>
                
                <div className={styles.filterGroup} style={{ flex: '1 1 200px' }}>
                    <FaFilter color="var(--txt-mut)"/>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterInput}>
                        <option value="all">كل الحالات</option>
                        <option value="active">متاح ✅</option>
                        <option value="upcoming">مجدول ⏳</option>
                        <option value="expired">منتهي 🚫</option>
                    </select>
                </div>

                <div className={`${styles.filterGroup} ${styles.dateFilter}`} style={{ flex: '1 1 300px' }}>
                    <FaCalendarAlt color="var(--txt-mut)"/>
                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>من</span>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={styles.filterInput} />
                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إلى</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={styles.filterInput} />
                </div>
            </div>

            <div className={styles.offersGrid}>
                {filteredOffers.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--txt-mut)', background: 'var(--card)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <h3>لا توجد عروض مطابقة للفلاتر الحالية.</h3>
                    </div>
                ) : (
                    filteredOffers.map(offer => (
                        <div key={offer.id} className={styles.offerCard} style={{ opacity: offer.status === 'expired' ? 0.6 : 1 }}>
                            <div className={styles.offerImageWrapper}>
                                <img src={offer.image} alt={offer.title} className={styles.offerImage} />
                                <div className={`${styles.badge} ${offer.status === 'active' ? styles.badgeActive : offer.status === 'upcoming' ? styles.badgeUpcoming : styles.badgeExpired}`}>
                                    {offer.status === 'active' ? 'متاح' : offer.status === 'upcoming' ? 'مجدول' : 'منتهي'}
                                </div>
                            </div>
                            <div className={styles.offerContent}>
                                <h3 className={styles.offerTitle}>{offer.title}</h3>
                                <div className={styles.offerStream}>{offer.stage} - {offer.stream}</div>
                                
                                <div className={styles.priceBox}>
                                    <div>
                                        <div className={styles.originalPrice}>{offer.originalPrice} ج.م</div>
                                        <div className={styles.currentPrice}>{offer.price} <span style={{fontSize:'0.9rem'}}>ج.م</span></div>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>إجمالي الأكواد</div>
                                        <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{offer.codesCount} <span style={{fontSize:'0.8rem', color:'var(--p-purple)'}}>كود</span></div>
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    fullWidth 
                                    onClick={() => router.push(`/admin/offers/${offer.id}`)} 
                                    style={{ marginTop: 'auto', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)' }}
                                >
                                    إدارة العرض
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 💡 مودال إضافة العرض */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة عرض جديد" maxWidth="800px">
                <div className={styles.formGrid} style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '10px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.formLabel}>اسم العرض</label>
                        <input className={styles.formInput} placeholder="مثال: باقة أبطال الثانوية" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className={styles.formLabel}>تاريخ البداية</label>
                        <input type="date" className={styles.formInput} value={offerForm.startDate} onChange={e => setOfferForm({...offerForm, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className={styles.formLabel}>تاريخ الانتهاء</label>
                        <input type="date" className={styles.formInput} value={offerForm.endDate} onChange={e => setOfferForm({...offerForm, endDate: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className={styles.formLabel}>السعر الأصلي (قبل الخصم)</label>
                        <input type="number" className={styles.formInput} placeholder="مثال: 1000" value={offerForm.originalPrice} onChange={e => setOfferForm({...offerForm, originalPrice: e.target.value})} />
                    </div>
                    <div>
                        <label className={styles.formLabel}>سعر العرض (الفعلي)</label>
                        <input type="number" className={styles.formInput} placeholder="مثال: 600" value={offerForm.price} onChange={e => setOfferForm({...offerForm, price: e.target.value})} />
                    </div>
                    
                    {/* 💡 حقل المرحلة */}
                    <div>
                        <label className={styles.formLabel}>المرحلة التعليمية</label>
                        <select className={styles.formSelect} value={offerForm.stage} onChange={e => setOfferForm({...offerForm, stage: e.target.value})}>
                            <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
                            <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
                            <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
                            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                        </select>
                    </div>
                    
                    {/* 💡 حقل الشعبة */}
                    <div>
                        <label className={styles.formLabel}>الشعبة</label>
                        <select className={styles.formSelect} value={offerForm.stream} onChange={e => setOfferForm({...offerForm, stream: e.target.value})}>
                            <option value="عام">عام</option>
                            <option value="علمي علوم">علمي علوم</option>
                            <option value="علمي رياضة">علمي رياضة</option>
                            <option value="أدبي">أدبي</option>
                        </select>
                    </div>

                    {/* 💡 حقل رفع الصورة */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.formLabel}>صورة العرض</label>
                        <label className={styles.fileUpload}>
                            <FaUpload /> {offerForm.image ? 'تم إرفاق الصورة بنجاح ✅' : 'اضغط لرفع صورة العرض'}
                            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.formLabel}>وصف تفصيلي للعرض</label>
                        <textarea className={styles.formInput} placeholder="اكتب تفاصيل العرض هنا..." value={offerForm.desc} onChange={e => setOfferForm({...offerForm, desc: e.target.value})} style={{ minHeight: '100px', resize: 'vertical' }}></textarea>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <Button variant="primary" fullWidth onClick={handleAddOffer}>حفظ وإضافة العرض</Button>
                    <Button variant="outline" fullWidth onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                </div>
            </Modal>
        </div>
    );
}