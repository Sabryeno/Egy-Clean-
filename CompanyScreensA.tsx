import 'dart:math';
import 'package:flutter/material.dart';
import 'models.dart';
import 'data.dart';
import 'i18n.dart';
import 'theme.dart';

typedef PillData = ({String label, Color bg, Color fg});
typedef ChipData = ({String label, Color bg, Color fg});
typedef PriceBreakdown = ({double labour, double supplies, double subtotal, double fee, double vat, double total});
typedef DateCell = ({String dow, int day, String mon, String full});

/// Single reactive store for the whole app. Every screen listens to this;
/// a booking, approval, or acknowledgement mutates shared state and calls
/// notifyListeners(), so bookings lists, the company dashboard, and the
/// notification feeds all update in real time.
class AppStore extends ChangeNotifier {
  final _rand = Random();

  // ---- core state ----
  Screen screen = Screen.splash;
  AppMode app = AppMode.auth;
  Acct acct = Acct.individual;
  bool corpApproved = true;
  String lang = 'en';
  String theme = 'light';

  int co = 0;
  int activeFilter = 2;
  String searchQuery = '';

  int ctIdx = 0, ptIdx = 0, hours = 2, cleaners = 1;
  bool supplies = false;
  int dateIdx = 1, timeIdx = 1;
  String address = '', notes = '';
  final Set<int> instr = {};
  int? payIdx;
  bool agree = false;

  String histTab = 'upcoming';
  bool photo = false;
  String mgr = '', sup = '';
  bool editingContacts = false;

  String pName = '', pEmail = '', pPhone = '', pCity = '';
  bool editingProfile = false;

  String lastId = '', lastMethod = 'card';

  List<CServiceItem> cServices = initialServices();
  List<StaffMember> staff = initialStaff();
  SvcForm? svcForm;
  StaffForm staffForm = StaffForm();

  String dashDate = 'week', dashSvc = 'all', dashStaff = 'all';
  bool filterOpen = false;

  List<Booking> bookings = initialBookings();
  List<IncomingJob> cIncoming = initialIncoming();
  List<CustomerHistoryItem> cHistory = initialCHistory();

  bool upLic = false, upId = false;

  late List<NotifItem> custNotifs;
  late List<NotifItem> compNotifs;

  AppStore() {
    custNotifs = _seedCustNotifs();
    compNotifs = _seedCompNotifs();
    // splash auto-advance
    Future.delayed(const Duration(milliseconds: 1900), () {
      if (screen == Screen.splash) {
        screen = Screen.login;
        notifyListeners();
      }
    });
  }

  // ---- derived ----
  Map<String, dynamic> get t => stringsFor(lang);
  bool get isAr => lang == 'ar';
  Palette get pal => theme == 'dark' ? Palette.dark : Palette.light;
  CompanyDef get company => kCompanies[co];
  TextDirection get dir => isAr ? TextDirection.rtl : TextDirection.ltr;
  List<String> ct() => (t['ct'] as List).cast<String>();
  List<String> pt() => (t['pt'] as List).cast<String>();

  String _grp(int n) {
    final s = n.abs().toString();
    final b = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) b.write(',');
      b.write(s[i]);
    }
    return (n < 0 ? '-' : '') + b.toString();
  }

  String fmt(num n) => '${isAr ? 'ج.م' : 'EGP'} ${_grp(n.round())}';

  PriceBreakdown price() {
    final rate = kRates[ctIdx], mult = kPropMult[ptIdx];
    final labour = rate * hours * cleaners * mult;
    final sup = supplies ? 100.0 : 0.0;
    final subtotal = labour + sup;
    final fee = subtotal * 0.05, vat = subtotal * 0.14;
    return (labour: labour.toDouble(), supplies: sup, subtotal: subtotal.toDouble(), fee: fee, vat: vat, total: subtotal + fee + vat);
  }

  List<DateCell> dateList() {
    final days = (t['days'] as List).cast<String>();
    final months = (t['months'] as List).cast<String>();
    final now = DateTime(2026, 7, 13);
    final out = <DateCell>[];
    for (int i = 0; i < 7; i++) {
      final d = now.add(Duration(days: i));
      final dow = days[d.weekday % 7];
      out.add((dow: dow, day: d.day, mon: months[d.month - 1], full: '$dow ${d.day} ${months[d.month - 1]}'));
    }
    return out;
  }

  String methodLabel(String key) {
    final m = {
      'card': isAr ? 'بطاقة' : 'Card', 'applepay': 'Apple Pay', 'gpay': 'Google Pay',
      'meeza': isAr ? 'ميزة' : 'Meeza', 'vodafone': isAr ? 'فودافون كاش' : 'Vodafone Cash',
      'instapay': 'InstaPay', 'cash': isAr ? 'كاش' : 'Cash',
    };
    return m[key] ?? m['card']!;
  }

  String payIdxKey(int i) => ['card', 'applepay', 'gpay', 'meeza', 'vodafone', 'instapay', 'cash'][i];

  PillData payPill(bool paid, String key) {
    final mm = methodLabel(key);
    if (paid) return (label: '✓ ${isAr ? 'مدفوع' : 'Paid'} · $mm', bg: kGreen.withValues(alpha: .13), fg: kGreen2);
    return (label: '● ${isAr ? 'غير مدفوع' : 'Unpaid'} · $mm', bg: kAmber.withValues(alpha: .15), fg: kAmber2);
  }

  ChipData tagChip(String code) {
    if (code == 'a') return (label: isAr ? 'متاح اليوم' : 'Available today', bg: kGreen.withValues(alpha: .13), fg: kGreen2);
    if (code == 't') return (label: isAr ? 'الأدوات مشمولة' : 'Tools included', bg: kPrimary.withValues(alpha: .1), fg: kPrimaryDark);
    return (label: isAr ? 'حجز فوري' : 'Instant', bg: kAmber.withValues(alpha: .15), fg: kAmber2);
  }

  String svcEmoji(int i) => (i >= 0 && i < kCleaningEmoji.length) ? kCleaningEmoji[i] : '🧹';
  Color svcBg(int i) => [kPrimary.withValues(alpha: .1), kGreen.withValues(alpha: .12), kPurple.withValues(alpha: .12), kAmber.withValues(alpha: .15), const Color(0xFF5A6472).withValues(alpha: .12)][i.clamp(0, 4)];
  String stars(double r) {
    final full = r.round().clamp(0, 5);
    return '★★★★★'.substring(0, full) + '☆☆☆☆☆'.substring(0, 5 - full);
  }

  int get pendingCount => cIncoming.where((j) => j.state == 'pending' || j.state == 'new').length;
  int get custUnread => custNotifs.where((n) => n.unread).length;
  int get compUnread => compNotifs.where((n) => n.unread).length;

  // ---- navigation & toggles ----
  void go(Screen s) { screen = s; notifyListeners(); }
  void toggleLang() { lang = isAr ? 'en' : 'ar'; notifyListeners(); }
  void toggleTheme() { theme = theme == 'dark' ? 'light' : 'dark'; notifyListeners(); }
  void pickAcct(Acct a) { acct = a; notifyListeners(); }

  // ---- auth ----
  void doLogin() {
    if (acct == Acct.corporate) { app = AppMode.company; corpApproved = true; screen = Screen.cHome; }
    else { app = AppMode.customer; screen = Screen.home; }
    notifyListeners();
  }
  void quickCustomer() { acct = Acct.individual; app = AppMode.customer; screen = Screen.home; notifyListeners(); }
  void quickCompany() { acct = Acct.corporate; app = AppMode.company; corpApproved = true; screen = Screen.cHome; notifyListeners(); }
  void doSignup() {
    if (acct == Acct.corporate) { screen = Screen.corpReg; }
    else { app = AppMode.customer; screen = Screen.home; }
    notifyListeners();
  }
  void submitReview() { corpApproved = false; screen = Screen.review; notifyListeners(); }
  void simulateApprove() { app = AppMode.company; corpApproved = true; screen = Screen.cHome; notifyListeners(); }
  void enterLimited() { app = AppMode.company; corpApproved = false; screen = Screen.cHome; notifyListeners(); }
  void logout() { app = AppMode.auth; screen = Screen.login; acct = Acct.individual; notifyListeners(); }
  void setUpload(String which) { if (which == 'lic') { upLic = true; } else { upId = true; } notifyListeners(); }
  void setActiveFilter(int i) { activeFilter = i; notifyListeners(); }
  void markCompNotifsRead() { for (final n in compNotifs) { n.unread = false; } notifyListeners(); }

  // ---- vendor / booking ----
  void openVendor(int i) { co = i; screen = Screen.vendor; notifyListeners(); }
  void startBooking() { screen = Screen.config; notifyListeners(); }
  void selectCleaning(int i) { ctIdx = i; notifyListeners(); }
  void openProp() { filterOpen = false; _propOpen = true; notifyListeners(); }
  bool _propOpen = false;
  bool get propOpen => _propOpen;
  void closeProp() { _propOpen = false; notifyListeners(); }
  void selectProperty(int i) { ptIdx = i; _propOpen = false; notifyListeners(); }
  void hoursInc() { hours = min(12, hours + 1); notifyListeners(); }
  void hoursDec() { hours = max(1, hours - 1); notifyListeners(); }
  void cleanersInc() { cleaners = min(4, cleaners + 1); notifyListeners(); }
  void cleanersDec() { cleaners = max(1, cleaners - 1); notifyListeners(); }
  void toggleSupplies() { supplies = !supplies; notifyListeners(); }
  void selectDate(int i) { dateIdx = i; notifyListeners(); }
  void selectTime(int i) { timeIdx = i; notifyListeners(); }
  void toggleInstr(int i) { instr.contains(i) ? instr.remove(i) : instr.add(i); notifyListeners(); }
  void setAddress(String v) { address = v; notifyListeners(); }
  void setNotes(String v) { notes = v; notifyListeners(); }
  void useLocation() { address = isAr ? '٩ شارع التسعين، التجمع الخامس، القاهرة' : '9 Ninety St, New Cairo, Cairo'; notifyListeners(); }
  void toggleAgree() { agree = !agree; notifyListeners(); }
  void selectPay(int i) { payIdx = i; notifyListeners(); }

  /// The signature real-time action: pushes the booking to the customer's list,
  /// creates a matching incoming job on the company dashboard, and drops a
  /// notification into both feeds — everything updates live.
  void pay() {
    if (payIdx == null) return;
    final mkey = payIdxKey(payIdx!);
    final isCash = mkey == 'cash';
    final id = 'EGY-${100000 + _rand.nextInt(900000)}';
    final c = company;
    final p = price();
    final ds = dateList()[dateIdx];
    final dt = '${ds.full} · ${kTimes[timeIdx]}';
    final svcName = ct()[ctIdx];

    bookings.insert(0, Booking(mono: c.mono, grad: c.grad, name: c.name[lang]!, service: svcName, datetime: dt, id: id, total: fmt(p.total), status: 'upcoming', paid: !isCash, method: isCash ? 'cash' : mkey));
    lastId = id;
    lastMethod = isCash ? 'cash' : mkey;

    cIncoming.insert(0, IncomingJob(customer: t['userName'] as String, service: '$svcName · ${hours}h', datetime: 'Today ${kTimes[timeIdx]}', total: fmt(p.total), method: isCash ? 'cash' : 'paid', state: isCash ? 'pending' : 'new', paid: !isCash, payMethod: isCash ? null : mkey, staff: staff.isNotEmpty ? staff[0].name : '—', svcIdx: ctIdx, bucket: 'today'));

    custNotifs.insert(0, NotifItem(icon: '✅', iconBg: kGreen.withValues(alpha: .12), title: isCash ? t['bookingRequested'] as String : (isAr ? 'تم تأكيد الحجز' : 'Booking confirmed'), body: '${c.name[lang]} · $svcName · $dt', time: isAr ? 'الآن' : 'Just now', unread: true));
    compNotifs.insert(0, NotifItem(icon: isCash ? '💵' : '✓', iconBg: isCash ? kAmber.withValues(alpha: .15) : kGreen.withValues(alpha: .12), title: isCash ? t['newBookingCash'] as String : t['newBookingPaid'] as String, body: '${t['userName']} · $svcName ${hours}h · ${isCash ? (isAr ? 'كاش' : 'cash') : methodLabel(mkey)}', time: isAr ? 'الآن' : 'Just now', unread: true));

    screen = Screen.success;
    notifyListeners();
  }

  // ---- bookings tabs / account ----
  void setHistTab(String v) { histTab = v; notifyListeners(); }
  void togglePhoto() { photo = !photo; notifyListeners(); }
  void startEditProfile() { editingProfile = true; notifyListeners(); }
  void saveProfile() { editingProfile = false; notifyListeners(); }
  void setPName(String v) { pName = v; }
  void setPEmail(String v) { pEmail = v; }
  void setPPhone(String v) { pPhone = v; }
  void setPCity(String v) { pCity = v; }
  void markCustNotifsRead() { for (final n in custNotifs) { n.unread = false; } notifyListeners(); }

  String get pNameV => pName.isNotEmpty ? pName : (isAr ? 'رنا مصطفى' : 'Rana Mostafa');
  String get pEmailV => pEmail.isNotEmpty ? pEmail : 'rana@email.com';
  String get pPhoneV => pPhone.isNotEmpty ? pPhone : '+20 100 123 4567';
  String get pCityV => pCity.isNotEmpty ? pCity : (isAr ? 'القاهرة الجديدة' : 'New Cairo');

  // ---- company: services ----
  void openAddService() { svcForm = SvcForm(editId: null, typeIdx: 0, rate: 100, cleaners: 1, capacity: ''); screen = Screen.cServiceForm; notifyListeners(); }
  void openEditService(CServiceItem s) { svcForm = SvcForm(editId: s.id, typeIdx: s.typeIdx, rate: s.rate, cleaners: s.cleaners, capacity: s.capacity); screen = Screen.cServiceForm; notifyListeners(); }
  void svcSetType(int i) { svcForm?.typeIdx = i; notifyListeners(); }
  void svcRateInc() { if (svcForm != null) { svcForm!.rate += 10; notifyListeners(); } }
  void svcRateDec() { if (svcForm != null) { svcForm!.rate = max(0, svcForm!.rate - 10); notifyListeners(); } }
  void svcCleanersInc() { if (svcForm != null) { svcForm!.cleaners = min(8, svcForm!.cleaners + 1); notifyListeners(); } }
  void svcCleanersDec() { if (svcForm != null) { svcForm!.cleaners = max(1, svcForm!.cleaners - 1); notifyListeners(); } }
  void svcSetCapacity(String v) { svcForm?.capacity = v; }
  void saveService() {
    final f = svcForm;
    if (f == null) return;
    if (f.editId != null) {
      cServices = cServices.map((x) => x.id == f.editId ? x.copyWith(typeIdx: f.typeIdx, rate: f.rate, cleaners: f.cleaners, capacity: f.capacity.isEmpty ? x.capacity : f.capacity) : x).toList();
    } else {
      cServices = [...cServices, CServiceItem(id: DateTime.now().millisecondsSinceEpoch, typeIdx: f.typeIdx, rate: f.rate, cleaners: f.cleaners, capacity: f.capacity.isEmpty ? '—' : f.capacity)];
    }
    svcForm = null;
    screen = Screen.cServices;
    notifyListeners();
  }
  void deleteService() {
    final f = svcForm;
    if (f?.editId == null) return;
    cServices = cServices.where((x) => x.id != f!.editId).toList();
    svcForm = null;
    screen = Screen.cServices;
    notifyListeners();
  }

  // ---- company: staff ----
  void openAddStaff() { staffForm = StaffForm(); screen = Screen.cStaffForm; notifyListeners(); }
  void staffSetName(String v) { staffForm.name = v; notifyListeners(); }
  void staffSetRole(String v) { staffForm.role = v; }
  void staffSetColor(Color c) { staffForm.color = c; notifyListeners(); }
  void saveStaff() {
    final f = staffForm;
    if (f.name.trim().isEmpty) return;
    staff = [...staff, StaffMember(name: f.name.trim(), mono: (f.name.trim().isNotEmpty ? f.name.trim()[0] : '?').toUpperCase(), color: f.color, rating: 5.0, jobs: 0, role: f.role.isEmpty ? (isAr ? 'عامل نظافة' : 'Cleaner') : f.role)];
    staffForm = StaffForm();
    screen = Screen.cProfile;
    notifyListeners();
  }
  void removeStaff(int i) { staff = [...staff]..removeAt(i); notifyListeners(); }

  // ---- company: contacts ----
  void startEditContacts() { editingContacts = true; notifyListeners(); }
  void saveContacts() { editingContacts = false; notifyListeners(); }
  void setMgr(String v) { mgr = v; }
  void setSup(String v) { sup = v; }
  String get mgrV => mgr.isNotEmpty ? mgr : '+20 100 555 1234';
  String get supV => sup.isNotEmpty ? sup : '+20 109 888 7766';

  // ---- company: dashboard filter ----
  void openFilter() { filterOpen = true; notifyListeners(); }
  void closeFilter() { filterOpen = false; notifyListeners(); }
  void setDashDate(String v) { dashDate = v; notifyListeners(); }
  void setDashSvc(String v) { dashSvc = v; notifyListeners(); }
  void setDashStaff(String v) { dashStaff = v; notifyListeners(); }
  void resetFilter() { dashDate = 'week'; dashSvc = 'all'; dashStaff = 'all'; notifyListeners(); }
  bool get filterActive => !(dashDate == 'week' && dashSvc == 'all' && dashStaff == 'all');
  bool passFilter(IncomingJob j) {
    final dOk = dashDate == 'today' ? j.bucket == 'today' : true;
    final sOk = dashSvc == 'all' || j.svcIdx.toString() == dashSvc;
    final stOk = dashStaff == 'all' || j.staff == dashStaff;
    return dOk && sOk && stOk;
  }
  List<IncomingJob> get filteredIncoming => cIncoming.where(passFilter).toList();

  // ---- company: incoming actions (real-time) ----
  void updIncoming(IncomingJob job, String newState) {
    job.state = newState;
    if (newState == 'approved') {
      custNotifs.insert(0, NotifItem(icon: '✅', iconBg: kGreen.withValues(alpha: .12), title: isAr ? 'تمت الموافقة على الحجز' : 'Booking approved', body: isAr ? 'وافقت الشركة على حجزك النقدي' : 'The company approved your cash booking', time: isAr ? 'الآن' : 'Just now', unread: true));
    } else if (newState == 'ack') {
      custNotifs.insert(0, NotifItem(icon: '🔄', iconBg: kPrimary.withValues(alpha: .1), title: isAr ? 'حجزك قيد التنفيذ' : 'Your booking is in process', body: isAr ? 'أكّدت الشركة استلام الدفع' : 'The company acknowledged your payment', time: isAr ? 'الآن' : 'Just now', unread: true));
    }
    notifyListeners();
  }

  // ---- seed notifications ----
  List<NotifItem> _seedCustNotifs() => [
        NotifItem(icon: '✅', iconBg: kGreen.withValues(alpha: .12), title: isAr ? 'تم تأكيد الحجز' : 'Booking confirmed', body: isAr ? 'Sparkle Masr · تنظيف عميق يوم الخميس ١٠:٠٠' : 'Sparkle Masr · Deep clean on Thu 10:00', time: isAr ? 'منذ ٥ دقائق' : '5 min ago', unread: true),
        NotifItem(icon: '⏰', iconBg: kPrimary.withValues(alpha: .1), title: isAr ? 'تذكير بالموعد' : 'Upcoming reminder', body: isAr ? 'فريقك يصل غداً الساعة ١٠ صباحاً' : 'Your team arrives tomorrow at 10:00', time: isAr ? 'منذ ساعة' : '1h ago', unread: true),
        NotifItem(icon: '⭐', iconBg: kAmber.withValues(alpha: .15), title: isAr ? 'قيّم خدمتك' : 'Rate your service', body: isAr ? 'كيف كانت تجربتك مع Lamsa Home؟' : 'How was your clean with Lamsa Home?', time: isAr ? 'أمس' : 'Yesterday', unread: false),
        NotifItem(icon: '🎁', iconBg: kPurple.withValues(alpha: .12), title: isAr ? 'خصم ٥٠٪' : '50% off your next clean', body: isAr ? 'استخدم كود CLEAN50 قبل نهاية الأسبوع' : 'Use code CLEAN50 before the weekend', time: isAr ? 'منذ يومين' : '2 days ago', unread: false),
      ];
  List<NotifItem> _seedCompNotifs() => [
        NotifItem(icon: '💵', iconBg: kAmber.withValues(alpha: .15), title: isAr ? 'حجز كاش جديد' : 'New cash booking', body: (isAr ? 'أحمد يوسف · تنظيف عميق ٣ ساعات — ' : 'Ahmed Youssef · Deep clean 3h — ') + (isAr ? 'يحتاج موافقتك' : 'Needs your approval'), time: isAr ? 'منذ ٥ دقائق' : '5 min ago', unread: true),
        NotifItem(icon: '✓', iconBg: kGreen.withValues(alpha: .12), title: isAr ? 'حجز مدفوع جديد' : 'New paid booking', body: isAr ? 'منى صالح · عادي ٢ ساعة · مدفوع بالكامل' : 'Mona Saleh · Standard 2h · paid in full', time: isAr ? 'منذ ٢٠ دقيقة' : '20 min ago', unread: true),
        NotifItem(icon: '⭐', iconBg: kAmber.withValues(alpha: .15), title: isAr ? 'تقييم جديد' : 'New review', body: isAr ? 'حصلت على ٥ نجوم من يوسف علي' : 'You received a 5-star rating from Youssef Ali', time: isAr ? 'منذ ساعة' : '1h ago', unread: false),
      ];
}
