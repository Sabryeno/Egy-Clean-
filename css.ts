import 'package:flutter/material.dart';
import '../models.dart';
import '../store.dart';
import '../theme.dart';
import '../widgets/ui.dart';
import '../widgets/sheets.dart';

Widget _pillBtn(String label, Color bg, Color fg, VoidCallback onTap) => GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(30)),
        child: Text(label, style: TextStyle(color: fg, fontWeight: FontWeight.w800, fontSize: 12.5)),
      ),
    );

// ================= COMPANY DASHBOARD =================
class CHomeScreen extends StatelessWidget {
  const CHomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final chart = [40, 62, 35, 80, 55, 100, 48];
    final dows = s.isAr ? ['سبت', 'أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع'] : ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
    final cmax = chart.reduce((a, b) => a > b ? a : b);
    Widget miniStat(String v, String label, Color color) => Expanded(child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
          child: Column(children: [Text(v, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: color)), const SizedBox(height: 2), Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: pal.muted, fontWeight: FontWeight.w600))]),
        ));
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Container(
          padding: EdgeInsets.fromLTRB(20, top + 6, 20, 22),
          decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF0E1726), Color(0xFF1E293F)]), borderRadius: BorderRadius.vertical(bottom: Radius.circular(26))),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(s.t['greeting'], style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: .7), fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text(s.company.name[s.lang]!, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: Colors.white)),
              ])),
              ChipButton(s.isAr ? 'EN' : 'عربي', s.toggleLang, bg: Colors.white.withValues(alpha: .14)),
              const SizedBox(width: 8),
              GestureDetector(onTap: () => s.go(Screen.cNotifs), child: Container(width: 34, height: 34, alignment: Alignment.center, decoration: BoxDecoration(color: Colors.white.withValues(alpha: .14), shape: BoxShape.circle), child: Stack(clipBehavior: Clip.none, alignment: Alignment.center, children: [
                const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 18),
                if (s.compUnread > 0) Positioned(right: 6, top: 6, child: Container(width: 8, height: 8, decoration: const BoxDecoration(color: kAmber, shape: BoxShape.circle))),
              ]))),
            ]),
            if (!s.corpApproved) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(color: kAmber.withValues(alpha: .16), borderRadius: BorderRadius.circular(14), border: Border.all(color: kAmber.withValues(alpha: .4))),
                child: Row(children: [
                  const Text('⏳', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(s.t['reviewTitle'], style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5, color: kAmber)),
                    const SizedBox(height: 1),
                    Text(s.t['limitedNote'], style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: .75), fontWeight: FontWeight.w500)),
                  ])),
                ]),
              ),
            ],
            const SizedBox(height: 14),
            Row(children: [
              _bigStat(s.t['todayBookings'], '4'),
              const SizedBox(width: 10),
              _bigStat(s.t['earnings'], s.fmt(18400)),
            ]),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.isAr ? 'نظرة عامة' : 'Overview', style: t800(15, pal.ink)),
            const SizedBox(height: 12),
            Row(children: [
              miniStat('42', s.isAr ? 'حجوزات الشهر' : 'Jobs (mo)', pal.ink),
              const SizedBox(width: 10),
              miniStat('88%', s.isAr ? 'مدفوعة' : 'Paid', kGreen),
              const SizedBox(width: 10),
              miniStat('⭐ 4.9', s.isAr ? 'التقييم' : 'Rating', kAmber2),
            ]),
            const SizedBox(height: 12),
            SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(s.isAr ? 'أرباح الأسبوع' : 'This week', style: t800(12.5, pal.ink)),
                Text(s.fmt(2400), style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
              ]),
              const SizedBox(height: 14),
              SizedBox(height: 100, child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                for (int i = 0; i < chart.length; i++) Expanded(child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                    Container(height: 70.0 * chart[i] / cmax + 6, decoration: BoxDecoration(color: chart[i] == cmax ? kPrimary : kPrimary.withValues(alpha: .28), borderRadius: BorderRadius.circular(6))),
                    const SizedBox(height: 6),
                    Text(dows[i], style: TextStyle(fontSize: 9.5, color: pal.muted, fontWeight: FontWeight.w700)),
                  ]),
                )),
              ])),
            ])),
            const SizedBox(height: 16),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(s.isAr ? 'تصفية النتائج' : 'Filter results', style: t800(12, pal.soft)),
              GestureDetector(
                onTap: () => showFilterSheet(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(30), border: Border.all(color: pal.line)),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.tune_rounded, size: 15, color: kPrimary),
                    const SizedBox(width: 7),
                    Text(_filterSummary(s), style: t800(12, pal.ink)),
                    if (s.filterActive) ...[const SizedBox(width: 6), Container(width: 7, height: 7, decoration: const BoxDecoration(color: kPrimary, shape: BoxShape.circle))],
                  ]),
                ),
              ),
            ]),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(s.t['incoming'], style: t800(15, pal.ink)),
              if (s.pendingCount > 0) Pill('${s.pendingCount} ${s.t['pending']}', kAmber.withValues(alpha: .15), kAmber2, fontSize: 11),
            ]),
            const SizedBox(height: 12),
            for (final j in s.filteredIncoming) ...[_incomingCard(context, j), const SizedBox(height: 12)],
          ]),
        ),
      ],
    );
  }

  String _filterSummary(AppStore s) {
    final n = (s.dashDate != 'week' ? 1 : 0) + (s.dashSvc != 'all' ? 1 : 0) + (s.dashStaff != 'all' ? 1 : 0);
    return n == 0 ? (s.isAr ? 'الكل' : 'All') : '$n ${s.isAr ? 'مطبّق' : 'active'}';
  }

  Widget _bigStat(String label, String v) => Expanded(child: Builder(builder: (context) {
        return Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(color: Colors.white.withValues(alpha: .1), borderRadius: BorderRadius.circular(14)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: .7), fontWeight: FontWeight.w600)),
            const SizedBox(height: 3),
            Text(v, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
          ]),
        );
      }));

  Widget _incomingCard(BuildContext context, IncomingJob j) {
    final s = context.store;
    final pal = context.pal;
    final pill = s.payPill(j.paid, j.paid ? (j.payMethod ?? 'card') : 'cash');
    Widget action;
    switch (j.state) {
      case 'pending':
        action = Row(mainAxisSize: MainAxisSize.min, children: [
          _pillBtn(s.t['decline'], pal.field, pal.soft, () => s.updIncoming(j, 'declined')),
          const SizedBox(width: 8),
          _pillBtn(s.t['approve'], kGreen, Colors.white, () => s.updIncoming(j, 'approved')),
        ]);
        break;
      case 'new':
        action = _pillBtn(s.t['acknowledge'], kPrimary, Colors.white, () => s.updIncoming(j, 'ack'));
        break;
      case 'approved':
        action = Text('✓ ${s.t['approve']}', style: const TextStyle(color: kGreen2, fontWeight: FontWeight.w800, fontSize: 12));
        break;
      case 'declined':
        action = Text('✕ ${s.t['decline']}', style: const TextStyle(color: kRed, fontWeight: FontWeight.w800, fontSize: 12));
        break;
      default:
        action = Text('✓ ${s.t['inProcess']}', style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w800, fontSize: 12));
    }
    return SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(j.customer, style: t800(14.5, pal.ink)),
          const SizedBox(height: 2),
          Text('${j.service} · ${j.datetime}', style: t500(11.5, pal.soft)),
        ])),
        Pill(pill.label, pill.bg, pill.fg, fontSize: 10),
      ]),
      const SizedBox(height: 12),
      Divider(height: 1, color: pal.line2),
      const SizedBox(height: 12),
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, crossAxisAlignment: CrossAxisAlignment.center, children: [
        Text(j.total, style: t800(16, pal.ink)),
        action,
      ]),
    ]));
  }
}

// ================= COMPANY SERVICES =================
class CServicesScreen extends StatelessWidget {
  const CServicesScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final areas = s.company.coverage[s.lang]!.split(RegExp('[,،]')).map((e) => e.trim()).toList();
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 14, 20, 24),
      children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(s.t['manageServices'], style: t800(20, pal.ink)),
          GestureDetector(onTap: s.openAddService, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 9),
            decoration: BoxDecoration(color: kPrimary, borderRadius: BorderRadius.circular(30)),
            child: Text('＋ ${s.t['addService']}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 12.5)),
          )),
        ]),
        const SizedBox(height: 6),
        Text(s.t['servicesSub'], style: t500(12.5, pal.soft)),
        const SizedBox(height: 16),
        for (final sv in s.cServices) ...[_serviceCard(context, sv), const SizedBox(height: 12)],
        const SizedBox(height: 10),
        SectionLabel(s.t['areaCovered']),
        const SizedBox(height: 10),
        SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const MapPlaceholder(height: 100),
          const SizedBox(height: 12),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final a in areas) Pill(a, kPrimary.withValues(alpha: .1), kPrimaryDark, fontSize: 11.5),
          ]),
        ])),
      ],
    );
  }

  Widget _serviceCard(BuildContext context, CServiceItem sv) {
    final s = context.store;
    final pal = context.pal;
    return SoftCard(
      onTap: () => s.openEditService(sv),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(width: 44, height: 44, alignment: Alignment.center, decoration: BoxDecoration(color: s.svcBg(sv.typeIdx), borderRadius: BorderRadius.circular(12)), child: Text(s.svcEmoji(sv.typeIdx), style: const TextStyle(fontSize: 22))),
          const SizedBox(width: 11),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.ct()[sv.typeIdx], style: t800(14.5, pal.ink)),
            const SizedBox(height: 1),
            Text((s.t['cts'] as List)[sv.typeIdx], style: t500(11.5, pal.soft)),
          ])),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text(s.fmt(sv.rate), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: kPrimary)),
            Text(s.t['perHour'], style: TextStyle(fontSize: 10, color: pal.muted, fontWeight: FontWeight.w600)),
          ]),
        ]),
        const SizedBox(height: 12),
        Divider(height: 1, color: pal.line2),
        const SizedBox(height: 12),
        Row(children: [
          _tag(pal, '👷 ${sv.cleaners} ${s.t['cleanersAvail']}'),
          const SizedBox(width: 8),
          _tag(pal, '📦 ${s.t['capacity']} ${sv.capacity}'),
          const Spacer(),
          Text(s.isAr ? 'تعديل ✎' : 'Edit ✎', style: const TextStyle(color: kPrimary, fontSize: 11, fontWeight: FontWeight.w800)),
        ]),
      ]),
    );
  }

  Widget _tag(Palette pal, String label) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(color: pal.field, borderRadius: BorderRadius.circular(30)),
        child: Text(label, style: TextStyle(color: pal.soft, fontSize: 10.5, fontWeight: FontWeight.w700)),
      );
}

// ================= COMPANY CUSTOMER HISTORY =================
class CHistoryScreen extends StatelessWidget {
  const CHistoryScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final list = s.cHistory.where((b) => b.status == s.histTab).toList();
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
    return Column(children: [
      Container(
        padding: EdgeInsets.fromLTRB(20, top + 14, 20, 0),
        decoration: BoxDecoration(color: pal.card, border: Border(bottom: BorderSide(color: pal.line))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(s.t['customerHistory'], style: t800(19, pal.ink)),
          const SizedBox(height: 14),
          Row(children: [tab(s.t['upcoming'], 'upcoming'), const SizedBox(width: 20), tab(s.t['past'], 'past')]),
        ]),
      ),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: list.length,
        separatorBuilder: (_, _) => const SizedBox(height: 13),
        itemBuilder: (_, i) {
          final b = list[i];
          final pill = s.payPill(b.paid, b.paid ? b.method : 'cash');
          final up = b.status == 'upcoming';
          return SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(b.customer, style: t800(14.5, pal.ink)),
                const SizedBox(height: 2),
                Text(b.service, style: t500(11.5, pal.soft)),
              ])),
              Pill(up ? '● ${s.t['confirmed']}' : s.t['completed'], up ? kGreen.withValues(alpha: .13) : pal.field, up ? kGreen2 : pal.soft),
            ]),
            const SizedBox(height: 10),
            Align(alignment: AlignmentDirectional.centerStart, child: Pill(pill.label, pill.bg, pill.fg, fontSize: 10)),
            const SizedBox(height: 11),
            Divider(height: 1, color: pal.line2),
            const SizedBox(height: 12),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(b.datetime, style: TextStyle(fontSize: 11.5, color: pal.soft, fontWeight: FontWeight.w600)),
              Text(b.total, style: t800(15, pal.ink)),
            ]),
          ]));
        },
      )),
    ]);
  }
}

// ================= COMPANY NOTIFICATIONS =================
class CNotifsScreen extends StatefulWidget {
  const CNotifsScreen({super.key});
  @override
  State<CNotifsScreen> createState() => _CNotifsScreenState();
}

class _CNotifsScreenState extends State<CNotifsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.store.markCompNotifsRead());
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 14, 20, 24),
      children: [
        Text(s.t['notifications'], style: t800(20, pal.ink)),
        const SizedBox(height: 16),
        for (final n in s.compNotifs) ...[
          SoftCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(width: 40, height: 40, alignment: Alignment.center, decoration: BoxDecoration(color: n.iconBg, borderRadius: BorderRadius.circular(11)), child: Text(n.icon, style: const TextStyle(fontSize: 19))),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(n.title, style: t800(13.5, pal.ink)),
                const SizedBox(height: 2),
                Text(n.body, style: TextStyle(fontSize: 12, color: pal.soft, fontWeight: FontWeight.w500, height: 1.4)),
                const SizedBox(height: 5),
                Text(n.time, style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
              ])),
            ]),
            if (n.title == s.t['newBookingCash']) ...[
              const SizedBox(height: 12),
              Row(children: [_pillBtn(s.t['decline'], pal.field, pal.soft, () {}), const SizedBox(width: 8), _pillBtn(s.t['approve'], kGreen, Colors.white, () {})]),
            ] else if (n.title == s.t['newBookingPaid']) ...[
              const SizedBox(height: 12),
              Align(alignment: AlignmentDirectional.centerStart, child: _pillBtn('${s.t['acknowledge']} · ${s.t['inProcess']}', kPrimary, Colors.white, () {})),
            ],
          ])),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

// ================= COMPANY PROFILE =================
class CProfileScreen extends StatefulWidget {
  const CProfileScreen({super.key});
  @override
  State<CProfileScreen> createState() => _CProfileScreenState();
}

class _CProfileScreenState extends State<CProfileScreen> {
  late final mgr = TextEditingController(text: context.store.mgrV);
  late final sup = TextEditingController(text: context.store.supV);
  @override
  void dispose() {
    mgr.dispose();
    sup.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final docs = [
      ['📄', s.t['tradeLicence'], 'TL-2019-88421', '12 / 2026', false],
      ['🪪', s.t['ownerId'], s.isAr ? 'أحمد سباركل' : 'Ahmed Sparkle', '09 / 2026', true],
      ['🏢', s.t['companyName'], s.company.name[s.lang]!, '', false],
    ];
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Container(
          padding: EdgeInsets.fromLTRB(20, top + 12, 20, 24),
          decoration: BoxDecoration(gradient: gradFrom(s.company.grad), borderRadius: const BorderRadius.vertical(bottom: Radius.circular(26))),
          child: Column(children: [
            MonoAvatar(s.company.mono, size: 70, radius: 20, font: 30, color: Colors.white, textColor: kPrimaryDark),
            const SizedBox(height: 12),
            Text(s.company.name[s.lang]!, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: .18), borderRadius: BorderRadius.circular(30)),
              child: Text(s.corpApproved ? '✓ ${s.t['approved']}' : '⏳ ${s.t['pendingReview']}', style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              SectionLabel(s.t['editContacts']),
              if (!s.editingContacts) GestureDetector(onTap: s.startEditContacts, child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: kPrimary.withValues(alpha: .1), borderRadius: BorderRadius.circular(30)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.edit_outlined, size: 13, color: kPrimary), const SizedBox(width: 5), Text(s.isAr ? 'تعديل' : 'Edit', style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w800, fontSize: 11.5))]),
              )),
            ]),
            const SizedBox(height: 10),
            SoftCard(child: s.editingContacts ? _contactsEdit(context) : _contactsView(context)),
            const SizedBox(height: 22),
            SectionLabel(s.t['verifiedDocs']),
            const SizedBox(height: 10),
            SoftCard(padding: EdgeInsets.zero, child: Column(children: [
              for (int i = 0; i < docs.length; i++) _docRow(context, docs[i], last: i == docs.length - 1),
            ])),
            const SizedBox(height: 10),
            Text(s.t['cannotEditDocs'], textAlign: TextAlign.center, style: TextStyle(fontSize: 11.5, color: pal.muted, fontWeight: FontWeight.w500, height: 1.5)),
            const SizedBox(height: 22),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              SectionLabel(s.isAr ? 'الطاقم' : 'Staff'),
              GestureDetector(onTap: s.openAddStaff, child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 8),
                decoration: BoxDecoration(color: kPrimary, borderRadius: BorderRadius.circular(30)),
                child: Text('＋ ${s.isAr ? 'إضافة' : 'Add staff'}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11.5)),
              )),
            ]),
            const SizedBox(height: 10),
            for (int i = 0; i < s.staff.length; i++) ...[_staffRow(context, i), const SizedBox(height: 10)],
            const SizedBox(height: 8),
            SoftCard(padding: EdgeInsets.zero, child: Column(children: [
              GestureDetector(onTap: s.toggleLang, behavior: HitTestBehavior.opaque, child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
                decoration: BoxDecoration(border: Border(bottom: BorderSide(color: pal.line2))),
                child: Row(children: [const Text('🌐', style: TextStyle(fontSize: 17)), const SizedBox(width: 12), Expanded(child: Text(s.t['language'], style: t700(13.5, pal.ink))), Text(s.isAr ? 'العربية' : 'English', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kPrimary))]),
              )),
              GestureDetector(onTap: s.toggleTheme, behavior: HitTestBehavior.opaque, child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
                child: Row(children: [Text(s.theme == 'dark' ? '☀️' : '🌙', style: const TextStyle(fontSize: 17)), const SizedBox(width: 12), Expanded(child: Text(s.t['appearance'], style: t700(13.5, pal.ink))), Text(s.theme == 'dark' ? (s.isAr ? 'داكن' : 'Dark') : (s.isAr ? 'فاتح' : 'Light'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kPrimary))]),
              )),
            ])),
            const SizedBox(height: 16),
            GestureDetector(onTap: s.logout, child: Container(
              padding: const EdgeInsets.symmetric(vertical: 15), alignment: Alignment.center,
              decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
              child: Text(s.t['logout'], style: const TextStyle(color: kRed, fontWeight: FontWeight.w700, fontSize: 14)),
            )),
          ]),
        ),
      ],
    );
  }

  Widget _contactsEdit(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    Widget f(String label, TextEditingController c, ValueChanged<String> on) => Padding(padding: const EdgeInsets.only(bottom: 13), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: pal.soft)),
          const SizedBox(height: 6),
          TextField(controller: c, onChanged: on, style: TextStyle(fontSize: 13.5, color: pal.ink), decoration: InputDecoration(filled: true, fillColor: pal.field, contentPadding: const EdgeInsets.symmetric(horizontal: 13, vertical: 13), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: pal.line)), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: kPrimary, width: 1.4)))),
        ]));
    return Column(children: [
      f(s.t['managerContact'], mgr, s.setMgr),
      f(s.t['supportContact'], sup, s.setSup),
      PrimaryButton(s.t['save'], s.saveContacts, fontSize: 13.5),
    ]);
  }

  Widget _contactsView(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    Widget row(Color bg, String emoji, String label, String value) => Row(children: [
          Container(width: 36, height: 36, alignment: Alignment.center, decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)), child: Text(emoji, style: const TextStyle(fontSize: 16))),
          const SizedBox(width: 11),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
            const SizedBox(height: 1),
            Text(value, style: t700(13.5, pal.ink)),
          ]),
        ]);
    return Column(children: [
      row(kPrimary.withValues(alpha: .1), '👤', s.t['managerContact'], s.mgrV),
      Padding(padding: const EdgeInsets.symmetric(vertical: 13), child: Divider(height: 1, color: pal.line2)),
      row(kGreen.withValues(alpha: .12), '🎧', s.t['supportContact'], s.supV),
    ]);
  }

  Widget _docRow(BuildContext context, List<dynamic> d, {bool last = false}) {
    final s = context.store;
    final pal = context.pal;
    final expSoon = d[4] as bool;
    final expiry = d[3] as String;
    final expLabel = expiry.isEmpty ? '' : (expSoon ? (s.isAr ? '⚠ تنتهي قريباً ' : '⚠ Expiring soon ') : (s.isAr ? 'تنتهي ' : 'Valid till ')) + expiry;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
      decoration: BoxDecoration(color: expSoon ? kAmber.withValues(alpha: .08) : null, border: last ? null : Border(bottom: BorderSide(color: pal.line2))),
      child: Row(children: [
        Text(d[0] as String, style: const TextStyle(fontSize: 17)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(d[1] as String, style: t700(13, pal.ink)),
          const SizedBox(height: 1),
          Text(d[2] as String, style: t500(11, pal.soft)),
          if (expLabel.isNotEmpty) ...[
            const SizedBox(height: 3),
            Text(expLabel, style: TextStyle(fontSize: 10.5, fontWeight: expSoon ? FontWeight.w800 : FontWeight.w700, color: expSoon ? kAmber2 : kGreen2)),
          ],
        ])),
        Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.lock_outline_rounded, size: 13, color: kGreen), const SizedBox(width: 4), Text(s.t['locked'], style: const TextStyle(color: kGreen, fontSize: 11, fontWeight: FontWeight.w700))]),
      ]),
    );
  }

  Widget _staffRow(BuildContext context, int i) {
    final s = context.store;
    final pal = context.pal;
    final st = s.staff[i];
    return SoftCard(padding: const EdgeInsets.all(13), radius: 14, child: Row(children: [
      MonoAvatar(st.mono ?? (st.name.isNotEmpty ? st.name[0].toUpperCase() : '?'), size: 46, radius: 23, font: 19, color: st.color),
      const SizedBox(width: 12),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(st.name, style: t800(13.5, pal.ink)),
        const SizedBox(height: 1),
        Text('${st.role} · ${st.jobs} ${s.isAr ? 'مهمة' : 'jobs'}', style: t500(11, pal.soft)),
        const SizedBox(height: 4),
        Row(children: [Text(s.stars(st.rating), style: const TextStyle(fontSize: 12, color: kAmber, fontWeight: FontWeight.w700)), const SizedBox(width: 5), Text(st.rating.toStringAsFixed(1), style: TextStyle(fontSize: 10.5, color: pal.muted))]),
      ])),
      GestureDetector(onTap: () => s.removeStaff(i), child: Container(width: 30, height: 30, alignment: Alignment.center, decoration: BoxDecoration(color: pal.field, shape: BoxShape.circle), child: Icon(Icons.close_rounded, size: 15, color: pal.muted))),
    ]));
  }
}

// ================= SERVICE FORM =================
class CServiceFormScreen extends StatefulWidget {
  const CServiceFormScreen({super.key});
  @override
  State<CServiceFormScreen> createState() => _CServiceFormScreenState();
}

class _CServiceFormScreenState extends State<CServiceFormScreen> {
  late final cap = TextEditingController(text: context.store.svcForm?.capacity ?? '');
  @override
  void dispose() {
    cap.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final f = s.svcForm;
    final top = MediaQuery.of(context).padding.top;
    final editing = f?.editId != null;
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 6, 20, 24),
      children: [
        Row(children: [BackCircle(onTap: () => s.go(Screen.cServices), bg: pal.field, icon: pal.ink), const SizedBox(width: 12), Text(editing ? (s.isAr ? 'تعديل الخدمة' : 'Edit service') : (s.isAr ? 'إضافة خدمة' : 'Add service'), style: t800(18, pal.ink))]),
        const SizedBox(height: 18),
        SectionLabel(s.t['cleaningType'], caps: true),
        const SizedBox(height: 10),
        GridView.count(
          crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 9, crossAxisSpacing: 9, childAspectRatio: 3.2,
          children: [
            for (int i = 0; i < s.ct().length; i++) () {
              final active = f?.typeIdx == i;
              return GestureDetector(
                onTap: () => s.svcSetType(i),
                child: Container(
                  padding: const EdgeInsets.all(13),
                  decoration: BoxDecoration(color: active ? kPrimary.withValues(alpha: .08) : pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: active ? kPrimary : pal.line, width: 1.5)),
                  child: Row(children: [Text(s.svcEmoji(i), style: const TextStyle(fontSize: 20)), const SizedBox(width: 9), Expanded(child: Text(s.ct()[i], style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: active ? kPrimary : pal.ink)))]),
                ),
              );
            }(),
          ],
        ),
        const SizedBox(height: 18),
        SectionLabel(s.isAr ? 'السعر بالساعة' : 'Rate per hour', caps: false),
        const SizedBox(height: 10),
        SoftCard(child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          RoundStep('−', false, s.svcRateDec, size: 40),
          SizedBox(width: 130, child: Column(children: [Text(s.fmt(f?.rate ?? 0), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 24, color: kPrimary)), Text(s.t['perHour'], style: TextStyle(fontSize: 10.5, color: pal.muted, fontWeight: FontWeight.w600))])),
          RoundStep('+', true, s.svcRateInc, size: 40),
        ])),
        const SizedBox(height: 14),
        SoftCard(child: Column(children: [
          Text(s.isAr ? 'عدد العمال' : 'Cleaners', style: TextStyle(fontSize: 11, color: pal.soft, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            RoundStep('−', false, s.svcCleanersDec, size: 34),
            SizedBox(width: 40, child: Text('${f?.cleaners ?? 1}', textAlign: TextAlign.center, style: t800(20, pal.ink))),
            RoundStep('+', true, s.svcCleanersInc, size: 34),
          ]),
        ])),
        const SizedBox(height: 16),
        SectionLabel(s.isAr ? 'السعة' : 'Capacity', caps: false),
        const SizedBox(height: 8),
        TextField(controller: cap, onChanged: s.svcSetCapacity, style: TextStyle(fontSize: 14, color: pal.ink), decoration: InputDecoration(hintText: s.isAr ? 'مثال: ١٢٠م² أو ٦ قطع' : 'e.g. 120m² or 6 pcs', hintStyle: TextStyle(color: pal.muted, fontWeight: FontWeight.w500), filled: true, fillColor: pal.field, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: pal.line)), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: kPrimary, width: 1.4)))),
        const SizedBox(height: 20),
        PrimaryButton(s.isAr ? 'حفظ الخدمة' : 'Save service', s.saveService),
        if (editing) ...[
          const SizedBox(height: 12),
          Center(child: GestureDetector(onTap: s.deleteService, child: Text(s.isAr ? 'حذف الخدمة' : 'Delete service', style: const TextStyle(color: kRed, fontWeight: FontWeight.w700, fontSize: 13)))),
        ],
      ],
    );
  }
}

// ================= STAFF FORM =================
class CStaffFormScreen extends StatefulWidget {
  const CStaffFormScreen({super.key});
  @override
  State<CStaffFormScreen> createState() => _CStaffFormScreenState();
}

class _CStaffFormScreenState extends State<CStaffFormScreen> {
  final nameC = TextEditingController();
  final roleC = TextEditingController();
  @override
  void dispose() {
    nameC.dispose();
    roleC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final colors = const [kPrimary, kGreen, kAmber, kPurple, kRed];
    final preview = s.staffForm.name.trim().isEmpty ? '+' : s.staffForm.name.trim()[0].toUpperCase();
    final canSave = s.staffForm.name.trim().isNotEmpty;
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 6, 20, 24),
      children: [
        Row(children: [BackCircle(onTap: () => s.go(Screen.cProfile), bg: pal.field, icon: pal.ink), const SizedBox(width: 12), Text(s.isAr ? 'إضافة' : 'Add staff', style: t800(18, pal.ink))]),
        const SizedBox(height: 20),
        Center(child: Column(children: [
          MonoAvatar(preview, size: 84, radius: 42, font: 34, color: s.staffForm.color),
          const SizedBox(height: 8),
          Text(s.isAr ? 'تُنشأ الأيقونة تلقائياً' : 'Monogram auto-generated', style: TextStyle(fontSize: 11.5, color: pal.muted, fontWeight: FontWeight.w600)),
        ])),
        const SizedBox(height: 16),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          for (final c in colors) Padding(padding: const EdgeInsets.symmetric(horizontal: 5.5), child: GestureDetector(
            onTap: () => s.staffSetColor(c),
            child: Container(width: 28, height: 28, decoration: BoxDecoration(color: c, shape: BoxShape.circle, border: s.staffForm.color == c ? Border.all(color: pal.card, width: 3) : null, boxShadow: s.staffForm.color == c ? [BoxShadow(color: c, blurRadius: 0, spreadRadius: 2)] : null)),
          )),
        ]),
        const SizedBox(height: 22),
        SectionLabel(s.isAr ? 'الاسم' : 'Name', caps: false),
        const SizedBox(height: 8),
        TextField(controller: nameC, onChanged: s.staffSetName, style: TextStyle(fontSize: 14, color: pal.ink), decoration: _dec(pal, s.isAr ? 'مثال: خالد إبراهيم' : 'e.g. Khaled Ibrahim')),
        const SizedBox(height: 14),
        SectionLabel(s.isAr ? 'الدور' : 'Role', caps: false),
        const SizedBox(height: 8),
        TextField(controller: roleC, onChanged: s.staffSetRole, style: TextStyle(fontSize: 14, color: pal.ink), decoration: _dec(pal, s.isAr ? 'مثال: أخصائي تنظيف عميق' : 'e.g. Deep-clean specialist')),
        const SizedBox(height: 22),
        PrimaryButton(s.isAr ? 'إضافة للطاقم' : 'Add to staff', canSave ? s.saveStaff : null, enabled: canSave),
      ],
    );
  }

  InputDecoration _dec(Palette pal, String hint) => InputDecoration(hintText: hint, hintStyle: TextStyle(color: pal.muted, fontWeight: FontWeight.w500), filled: true, fillColor: pal.field, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: pal.line)), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: kPrimary, width: 1.4)));
}
