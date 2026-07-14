import 'package:flutter/material.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets/ui.dart';

Widget _simpleHeader(BuildContext context, String title, VoidCallback onBack) {
  final pal = context.pal;
  final top = MediaQuery.of(context).padding.top;
  return Container(
    padding: EdgeInsets.fromLTRB(20, top + 6, 20, 14),
    decoration: BoxDecoration(color: pal.card, border: Border(bottom: BorderSide(color: pal.line))),
    child: Row(children: [
      BackCircle(onTap: onBack, bg: pal.field, icon: pal.ink),
      const SizedBox(width: 12),
      Text(title, style: t800(17, pal.ink)),
    ]),
  );
}

// ================= SUMMARY =================
class SummaryScreen extends StatelessWidget {
  const SummaryScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final c = s.company;
    final p = s.price();
    final ds = s.dateList()[s.dateIdx];
    final rows = [
      [s.t['service'], s.ct()[s.ctIdx]],
      [s.t['property'], s.pt()[s.ptIdx]],
      [s.t['hours'], '${s.hours}'],
      [s.t['cleanersK'], '${s.cleaners}'],
      [s.t['dateTime'], '${ds.full} · ${kTimesRef[s.timeIdx]}'],
      [s.isAr ? 'العنوان' : 'Address', s.address.isEmpty ? s.t['none'] : s.address],
    ];
    Widget priceRow(String k, String v, {bool strong = false, Color? vc, double top = 6}) => Padding(
          padding: EdgeInsets.symmetric(vertical: top),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(k, style: TextStyle(fontSize: strong ? 15 : 13, color: strong ? pal.ink : pal.soft, fontWeight: strong ? FontWeight.w800 : FontWeight.w500)),
            Text(v, style: TextStyle(fontSize: strong ? 17 : 13, color: vc ?? pal.ink, fontWeight: strong ? FontWeight.w800 : FontWeight.w700)),
          ]),
        );
    return Column(children: [
      _simpleHeader(context, s.t['summary'], () => s.go(Screen.schedule)),
      Expanded(child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
        children: [
          SoftCard(padding: const EdgeInsets.all(13), child: Row(children: [
            MonoAvatar(c.mono, size: 50, radius: 12, font: 22, gradient: gradFrom(c.grad)),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(c.name[s.lang]!, style: t800(15, pal.ink)),
              const SizedBox(height: 2),
              Text('⭐ ${c.rating} · ${c.tag[s.lang]}', style: t500(12, pal.soft), maxLines: 1, overflow: TextOverflow.ellipsis),
            ])),
          ])),
          const SizedBox(height: 14),
          SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.t['details'], style: t800(13.5, pal.ink)),
            const SizedBox(height: 6),
            for (final r in rows) Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(border: Border(bottom: BorderSide(color: pal.line2))),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(r[0], style: TextStyle(fontSize: 12.5, color: pal.soft, fontWeight: FontWeight.w500)),
                Flexible(child: Text(r[1], textAlign: TextAlign.end, style: TextStyle(fontSize: 12.5, color: pal.ink, fontWeight: FontWeight.w700))),
              ]),
            ),
          ])),
          const SizedBox(height: 14),
          SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.t['priceBreakdown'], style: t800(13.5, pal.ink)),
            const SizedBox(height: 4),
            priceRow(s.t['labour'], s.fmt(p.labour)),
            priceRow(s.t['supplies'], s.fmt(p.supplies)),
            Container(decoration: BoxDecoration(border: Border(top: BorderSide(color: pal.line2))), child: priceRow(s.t['subtotal'], s.fmt(p.subtotal))),
            priceRow(s.t['platformFee'], s.fmt(p.fee)),
            priceRow(s.t['vat'], s.fmt(p.vat)),
            Container(decoration: BoxDecoration(border: Border(top: BorderSide(color: pal.line, width: 2))), child: priceRow(s.t['total'], s.fmt(p.total), strong: true, vc: kPrimary, top: 10)),
          ])),
          const SizedBox(height: 14),
          GestureDetector(
            onTap: s.toggleAgree,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: s.agree ? kGreen.withValues(alpha: .08) : pal.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: s.agree ? kGreen.withValues(alpha: .4) : pal.line),
              ),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Container(
                  width: 22, height: 22, alignment: Alignment.center,
                  decoration: BoxDecoration(color: s.agree ? kGreen : Colors.transparent, borderRadius: BorderRadius.circular(7), border: Border.all(color: s.agree ? kGreen : pal.muted, width: 2)),
                  child: s.agree ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
                ),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.t['cancelTitle'], style: t700(12.5, pal.ink)),
                  const SizedBox(height: 2),
                  Text(s.t['cancelBody'], style: TextStyle(fontSize: 11.5, color: pal.soft, fontWeight: FontWeight.w500, height: 1.4)),
                ])),
              ]),
            ),
          ),
        ],
      )),
    ]);
  }
}

const kTimesRef = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

// ================= PAYMENT =================
class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final methods = <Map<String, dynamic>>[
      {'k': 'pay0', 'icon': '💳', 'bg': kPrimary.withValues(alpha: .1), 'fg': kPrimary},
      {'k': 'pay1', 'apple': true, 'bg': const Color(0xFF0E1726), 'fg': Colors.white},
      {'k': 'pay2', 'icon': 'G', 'bg': Colors.white, 'fg': const Color(0xFF4285F4)},
      {'k': 'pay3', 'icon': 'M', 'bg': kPurple.withValues(alpha: .12), 'fg': kPurple},
      {'k': 'pay4', 'icon': 'V', 'bg': const Color(0x1AE60000), 'fg': const Color(0xFFE60000)},
      {'k': 'pay5', 'icon': '⚡', 'bg': kGreen.withValues(alpha: .12), 'fg': kGreen2},
      {'k': 'pay6', 'icon': '💵', 'bg': kAmber.withValues(alpha: .15), 'fg': kAmber2},
    ];
    return Column(children: [
      _simpleHeader(context, s.t['payment'], () => s.go(Screen.summary)),
      Expanded(child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
        children: [
          Text((s.t['choosePay'] as String).toUpperCase(), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: pal.muted, letterSpacing: .5)),
          const SizedBox(height: 12),
          for (int i = 0; i < methods.length; i++) () {
            final m = methods[i];
            final pair = (s.t[m['k']] as List).cast<String>();
            final active = i == s.payIdx;
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GestureDetector(
                onTap: () => s.selectPay(i),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
                  decoration: BoxDecoration(
                    color: active ? kPrimary.withValues(alpha: .07) : pal.card,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: active ? kPrimary : pal.line, width: 1.5),
                  ),
                  child: Row(children: [
                    Container(
                      width: 38, height: 38, alignment: Alignment.center,
                      decoration: BoxDecoration(color: m['bg'] as Color, borderRadius: BorderRadius.circular(10)),
                      child: m['apple'] == true
                          ? const Icon(Icons.apple, color: Colors.white, size: 20)
                          : Text(m['icon'] as String, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: m['fg'] as Color)),
                    ),
                    const SizedBox(width: 13),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(pair[0], style: t700(14, pal.ink)),
                      const SizedBox(height: 1),
                      Text(pair[1], style: t500(11.5, pal.soft)),
                    ])),
                    Container(
                      width: 22, height: 22, alignment: Alignment.center,
                      decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: active ? kPrimary : pal.line, width: 2)),
                      child: active ? Container(width: 10, height: 10, decoration: const BoxDecoration(color: kPrimary, shape: BoxShape.circle)) : null,
                    ),
                  ]),
                ),
              ),
            );
          }(),
        ],
      )),
    ]);
  }
}

// ================= SUCCESS =================
class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final c = s.company;
    final ds = s.dateList()[s.dateIdx];
    final rows = [
      [s.isAr ? 'رقم الحجز' : 'Booking ID', s.lastId.isEmpty ? '—' : s.lastId],
      [s.t['service'], '${c.name[s.lang]} · ${s.ct()[s.ctIdx]}'],
      [s.t['dateTime'], '${ds.full} · ${kTimesRef[s.timeIdx]}'],
      [s.t['addr'], s.address.isEmpty ? s.t['none'] : s.address],
    ];
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
        child: Column(children: [
          const SizedBox(height: 20),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.4, end: 1),
            duration: const Duration(milliseconds: 500),
            curve: Curves.elasticOut,
            builder: (_, v, child) => Transform.scale(scale: v, child: child),
            child: Container(
              width: 104, height: 104, alignment: Alignment.center,
              decoration: BoxDecoration(color: kGreen.withValues(alpha: .12), shape: BoxShape.circle),
              child: Container(width: 74, height: 74, decoration: const BoxDecoration(color: kGreen, shape: BoxShape.circle), child: const Icon(Icons.check_rounded, color: Colors.white, size: 40)),
            ),
          ),
          const SizedBox(height: 20),
          Text(s.lastMethod == 'cash' ? s.t['bookingRequested'] : s.t['paySuccess'], style: t800(23, pal.ink)),
          const SizedBox(height: 6),
          Text(s.t['bookingConfirmed'], style: t500(13.5, pal.soft)),
          const SizedBox(height: 22),
          SoftCard(child: Column(children: [
            for (final r in rows) Container(
              padding: const EdgeInsets.symmetric(vertical: 9),
              decoration: BoxDecoration(border: Border(bottom: BorderSide(color: pal.line2))),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(r[0], style: TextStyle(fontSize: 12.5, color: pal.soft, fontWeight: FontWeight.w500)),
                Flexible(child: Text(r[1], textAlign: TextAlign.end, style: TextStyle(fontSize: 12.5, color: pal.ink, fontWeight: FontWeight.w700))),
              ]),
            ),
            Padding(padding: const EdgeInsets.only(top: 11), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(s.t['amountPaid'], style: t800(14, pal.ink)),
              Text(s.fmt(s.price().total), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: kGreen)),
            ])),
          ])),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(child: _outlineBtn(context, Icons.description_outlined, s.t['invoice'])),
            const SizedBox(width: 10),
            Expanded(child: _outlineBtn(context, Icons.share_outlined, s.t['share'])),
          ]),
          const SizedBox(height: 14),
          PrimaryButton(s.t['viewBookings'], () => s.go(Screen.bookings)),
        ]),
      ),
    );
  }

  Widget _outlineBtn(BuildContext context, IconData icon, String label) {
    final pal = context.pal;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 13),
      decoration: BoxDecoration(color: pal.field, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, size: 16, color: pal.ink),
        const SizedBox(width: 7),
        Text(label, style: t700(13, pal.ink)),
      ]),
    );
  }
}

// ================= BOOKINGS =================
class BookingsScreen extends StatelessWidget {
  const BookingsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final list = s.bookings.where((b) => b.status == s.histTab).toList();
    return Column(children: [
      Container(
        padding: EdgeInsets.fromLTRB(20, top + 14, 20, 0),
        decoration: BoxDecoration(color: pal.card, border: Border(bottom: BorderSide(color: pal.line))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(s.t['myBookings'], style: t800(19, pal.ink)),
            ChipButton(s.isAr ? 'EN' : 'عربي', s.toggleLang, bg: pal.field, fg: pal.ink),
          ]),
          const SizedBox(height: 14),
          _tabs(context),
        ]),
      ),
      Expanded(child: list.isEmpty
          ? _empty(context)
          : ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: list.length,
              separatorBuilder: (_, _) => const SizedBox(height: 13),
              itemBuilder: (_, i) => _bookingCard(context, list[i]),
            )),
    ]);
  }

  Widget _tabs(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    Widget tab(String label, String key) {
      final active = s.histTab == key;
      return GestureDetector(
        onTap: () => s.setHistTab(key),
        behavior: HitTestBehavior.opaque,
        child: Container(
          padding: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(border: Border(bottom: BorderSide(color: active ? kPrimary : Colors.transparent, width: 2.5))),
          child: Text(label, style: TextStyle(fontWeight: active ? FontWeight.w800 : FontWeight.w700, fontSize: 14, color: active ? kPrimary : pal.muted)),
        ),
      );
    }
    return Row(children: [tab(s.t['upcoming'], 'upcoming'), const SizedBox(width: 20), tab(s.t['past'], 'past')]);
  }

  Widget _bookingCard(BuildContext context, Booking b) {
    final s = context.store;
    final pal = context.pal;
    final pill = s.payPill(b.paid, b.paid ? b.method : 'cash');
    final up = b.status == 'upcoming';
    return SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        MonoAvatar(b.mono, size: 44, radius: 11, font: 19, gradient: gradFrom(b.grad)),
        const SizedBox(width: 11),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(b.name, style: t800(14.5, pal.ink)),
          const SizedBox(height: 1),
          Text(b.service, style: t500(11.5, pal.soft)),
        ])),
        Pill(up ? '● ${s.t['confirmed']}' : s.t['completed'], up ? kGreen.withValues(alpha: .13) : pal.field, up ? kGreen2 : pal.soft),
      ]),
      const SizedBox(height: 10),
      Align(alignment: AlignmentDirectional.centerStart, child: Pill(pill.label, pill.bg, pill.fg, fontSize: 10)),
      const SizedBox(height: 11),
      Divider(height: 1, color: pal.line2),
      const SizedBox(height: 12),
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, crossAxisAlignment: CrossAxisAlignment.end, children: [
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(b.datetime, style: TextStyle(fontSize: 11.5, color: pal.soft, fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(b.id, style: TextStyle(fontSize: 11.5, color: pal.muted, fontWeight: FontWeight.w600)),
        ]),
        Text(b.total, style: t800(16, pal.ink)),
      ]),
    ]));
  }

  Widget _empty(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    return Center(child: Padding(
      padding: const EdgeInsets.all(30),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        const Text('🧺', style: TextStyle(fontSize: 60)),
        const SizedBox(height: 14),
        Text(s.histTab == 'upcoming' ? s.t['emptyUpTitle'] : s.t['emptyPastTitle'], style: t800(17, pal.ink)),
        const SizedBox(height: 6),
        Text(s.t['emptyBody'], textAlign: TextAlign.center, style: t500(13, pal.soft)),
        const SizedBox(height: 18),
        GestureDetector(onTap: () => s.go(Screen.home), child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 13),
          decoration: BoxDecoration(color: kPrimary, borderRadius: BorderRadius.circular(14)),
          child: Text(s.t['browse'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14)),
        )),
      ]),
    ));
  }
}

// ================= ACCOUNT =================
class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    Widget settingRow(String emoji, String label, Widget trailing, {VoidCallback? onTap, bool border = true}) => GestureDetector(
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
            decoration: BoxDecoration(border: border ? Border(bottom: BorderSide(color: pal.line2)) : null),
            child: Row(children: [
              Text(emoji, style: const TextStyle(fontSize: 17)),
              const SizedBox(width: 12),
              Expanded(child: Text(label, style: t700(13.5, pal.ink))),
              trailing,
            ]),
          ),
        );
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 14, 20, 24),
      children: [
        Text(s.t['account'], style: t800(20, pal.ink)),
        const SizedBox(height: 16),
        SoftCard(padding: const EdgeInsets.all(18), radius: 18, child: Column(children: [
          GestureDetector(
            onTap: s.togglePhoto,
            child: Stack(children: [
              Container(
                width: 76, height: 76, alignment: Alignment.center,
                decoration: BoxDecoration(shape: BoxShape.circle, gradient: s.photo ? gradFrom(const [kPrimary, kPrimaryDark]) : null, color: s.photo ? null : pal.field),
                child: Text(s.photo ? 'RM' : '👤', style: TextStyle(fontSize: s.photo ? 26 : 32, fontWeight: FontWeight.w800, color: Colors.white)),
              ),
              PositionedDirectional(bottom: 0, end: 0, child: Container(width: 26, height: 26, alignment: Alignment.center, decoration: BoxDecoration(color: kPrimary, shape: BoxShape.circle, border: Border.all(color: pal.card, width: 2)), child: const Icon(Icons.camera_alt, size: 13, color: Colors.white))),
            ]),
          ),
          const SizedBox(height: 12),
          Text(s.pNameV, style: t800(17, pal.ink)),
          const SizedBox(height: 2),
          Text('${s.pEmailV} · ${s.pPhoneV}', style: t500(12.5, pal.soft)),
          const SizedBox(height: 8),
          Text(s.photo ? (s.isAr ? 'اضغط لتغيير الصورة' : 'Tap to change photo') : (s.isAr ? 'اضغط لإضافة صورة' : 'Tap to add photo'), style: const TextStyle(fontSize: 11.5, color: kPrimary, fontWeight: FontWeight.w700)),
        ])),
        const SizedBox(height: 22),
        SectionLabel(s.t['wallet']),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(gradient: gradFrom(const [kPrimary, kPrimaryDark]), borderRadius: BorderRadius.circular(18)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.t['walletBalance'], style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: .82), fontWeight: FontWeight.w600)),
            const SizedBox(height: 3),
            Text(s.fmt(450), style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
            const SizedBox(height: 16),
            const Text('•••• •••• •••• 4821', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 2, color: Colors.white)),
            const SizedBox(height: 8),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('Rana Mostafa', style: TextStyle(fontSize: 11.5, color: Colors.white.withValues(alpha: .82), fontWeight: FontWeight.w600)),
              Text('${s.t['expires']} 08/28', style: TextStyle(fontSize: 11.5, color: Colors.white.withValues(alpha: .82), fontWeight: FontWeight.w600)),
            ]),
          ]),
        ),
        const SizedBox(height: 10),
        DottedAddCard(label: '＋ ${s.t['addCard']}', onTap: () => _snack(context, s.isAr ? 'إضافة بطاقة (تجريبي)' : 'Add card (demo)')),
        const SizedBox(height: 22),
        SectionLabel(s.t['settings']),
        const SizedBox(height: 10),
        SoftCard(padding: EdgeInsets.zero, child: Column(children: [
          settingRow('👤', s.t['personalDetails'], Text(s.chevron, style: TextStyle(color: pal.muted, fontSize: 16)), onTap: () => s.go(Screen.custProfile)),
          settingRow('🌐', s.t['language'], Text(s.langFull, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kPrimary)), onTap: s.toggleLang),
          settingRow(s.theme == 'dark' ? '☀️' : '🌙', s.t['appearance'], Text(s.themeLabel, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kPrimary)), onTap: s.toggleTheme),
          settingRow('💬', s.t['help'], Text(s.chevron, style: TextStyle(color: pal.muted, fontSize: 16)), border: false, onTap: () => _snack(context, s.isAr ? 'الدعم قريباً' : 'Support — coming soon')),
        ])),
        const SizedBox(height: 16),
        GestureDetector(onTap: s.logout, child: Container(
          padding: const EdgeInsets.symmetric(vertical: 15), alignment: Alignment.center,
          decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
          child: Text(s.t['logout'], style: const TextStyle(color: kRed, fontWeight: FontWeight.w700, fontSize: 14)),
        )),
      ],
    );
  }
}

extension _StoreLabels on AppStore {
  String get chevron => isAr ? '‹' : '›';
  String get langFull => isAr ? 'العربية' : 'English';
  String get themeLabel => theme == 'dark' ? (isAr ? 'داكن' : 'Dark') : (isAr ? 'فاتح' : 'Light');
}

void _snack(BuildContext context, String msg) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), duration: const Duration(seconds: 2), behavior: SnackBarBehavior.floating));
}

class DottedAddCard extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const DottedAddCard({super.key, required this.label, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14), alignment: Alignment.center,
        decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
        child: Text(label, style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w700, fontSize: 13)),
      ),
    );
  }
}

// ================= CUSTOMER NOTIFICATIONS =================
class CustNotifsScreen extends StatefulWidget {
  const CustNotifsScreen({super.key});
  @override
  State<CustNotifsScreen> createState() => _CustNotifsScreenState();
}

class _CustNotifsScreenState extends State<CustNotifsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.store.markCustNotifsRead());
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    return Column(children: [
      _simpleHeader(context, s.t['notifications'], () => s.go(Screen.home)),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: s.custNotifs.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final n = s.custNotifs[i];
          return SoftCard(child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(width: 40, height: 40, alignment: Alignment.center, decoration: BoxDecoration(color: n.iconBg, borderRadius: BorderRadius.circular(11)), child: Text(n.icon, style: const TextStyle(fontSize: 19))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(n.title, style: t800(13.5, pal.ink)),
              const SizedBox(height: 2),
              Text(n.body, style: TextStyle(fontSize: 12, color: pal.soft, fontWeight: FontWeight.w500, height: 1.4)),
              const SizedBox(height: 5),
              Text(n.time, style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
            ])),
            if (n.unread) Container(width: 8, height: 8, margin: const EdgeInsets.only(top: 4), decoration: const BoxDecoration(color: kPrimary, shape: BoxShape.circle)),
          ]));
        },
      )),
    ]);
  }
}

// ================= CUSTOMER PROFILE =================
class CustProfileScreen extends StatefulWidget {
  const CustProfileScreen({super.key});
  @override
  State<CustProfileScreen> createState() => _CustProfileScreenState();
}

class _CustProfileScreenState extends State<CustProfileScreen> {
  late final name = TextEditingController(text: context.store.pNameV);
  late final email = TextEditingController(text: context.store.pEmailV);
  late final phone = TextEditingController(text: context.store.pPhoneV);
  late final city = TextEditingController(text: context.store.pCityV);
  @override
  void dispose() {
    for (final c in [name, email, phone, city]) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final top = MediaQuery.of(context).padding.top;
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Container(
          padding: EdgeInsets.fromLTRB(20, top + 6, 20, 26),
          decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [kPrimary, kPrimaryDark]), borderRadius: BorderRadius.vertical(bottom: Radius.circular(26))),
          child: Column(children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              BackCircle(onTap: () => s.go(Screen.account), bg: Colors.white.withValues(alpha: .18), icon: Colors.white),
              Text(s.isAr ? 'الملف الشخصي' : 'Personal details', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Colors.white)),
              s.editingProfile
                  ? const SizedBox(width: 36)
                  : GestureDetector(onTap: s.startEditProfile, child: Container(
                      height: 34, padding: const EdgeInsets.symmetric(horizontal: 13), alignment: Alignment.center,
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: .18), borderRadius: BorderRadius.circular(30)),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.edit_outlined, size: 13, color: Colors.white), const SizedBox(width: 5), Text(s.isAr ? 'تعديل' : 'Edit', style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Colors.white))]),
                    )),
            ]),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: s.togglePhoto,
              child: Container(
                width: 82, height: 82, alignment: Alignment.center,
                decoration: BoxDecoration(shape: BoxShape.circle, color: s.photo ? Colors.white : Colors.white.withValues(alpha: .28), border: Border.all(color: Colors.white.withValues(alpha: .4), width: 3)),
                child: Text(s.photo ? (s.isAr ? 'ر' : 'R') : '👤', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800, color: kPrimaryDark)),
              ),
            ),
            const SizedBox(height: 12),
            Text(s.pNameV, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 19, color: Colors.white)),
            const SizedBox(height: 3),
            Text(s.isAr ? 'عضو منذ ٢٠٢٤' : 'Member since 2024', style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: .82), fontWeight: FontWeight.w500)),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
          child: s.editingProfile ? _editForm(context) : _viewCard(context),
        ),
      ],
    );
  }

  Widget _editForm(BuildContext context) {
    final s = context.store;
    Widget f(String label, TextEditingController c, ValueChanged<String> on) {
      final pal = context.pal;
      return Padding(padding: const EdgeInsets.only(bottom: 13), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: pal.soft)),
        const SizedBox(height: 6),
        TextField(controller: c, onChanged: on, style: TextStyle(fontSize: 14, color: pal.ink), decoration: _inputDec2(pal)),
      ]));
    }
    return Column(children: [
      f(s.isAr ? 'الاسم الكامل' : 'Full name', name, s.setPName),
      f(s.isAr ? 'البريد الإلكتروني' : 'Email', email, s.setPEmail),
      f(s.isAr ? 'رقم الموبايل' : 'Mobile number', phone, s.setPPhone),
      f(s.isAr ? 'المدينة / المنطقة' : 'City / Area', city, s.setPCity),
      const SizedBox(height: 4),
      PrimaryButton(s.isAr ? 'حفظ البيانات' : 'Save details', s.saveProfile),
    ]);
  }

  Widget _viewCard(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    Widget row(Color bg, String emoji, String label, String value, {bool border = true}) => Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(border: border ? Border(bottom: BorderSide(color: pal.line2)) : null),
          child: Row(children: [
            Container(width: 36, height: 36, alignment: Alignment.center, decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)), child: Text(emoji, style: const TextStyle(fontSize: 15))),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
              const SizedBox(height: 1),
              Text(value, style: t700(13.5, pal.ink)),
            ]),
          ]),
        );
    return SoftCard(padding: EdgeInsets.zero, child: Column(children: [
      row(kPrimary.withValues(alpha: .1), '👤', s.isAr ? 'الاسم الكامل' : 'Full name', s.pNameV),
      row(kGreen.withValues(alpha: .12), '✉️', s.isAr ? 'البريد الإلكتروني' : 'Email', s.pEmailV),
      row(kAmber.withValues(alpha: .15), '📱', s.isAr ? 'رقم الموبايل' : 'Mobile number', s.pPhoneV),
      row(kPurple.withValues(alpha: .12), '📍', s.isAr ? 'المدينة / المنطقة' : 'City / Area', s.pCityV, border: false),
    ]));
  }
}

InputDecoration _inputDec2(Palette pal) => InputDecoration(
      filled: true,
      fillColor: pal.field,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: pal.line)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: kPrimary, width: 1.4)),
    );
