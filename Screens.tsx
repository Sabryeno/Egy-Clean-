import 'package:flutter/material.dart';
import '../theme.dart';
import '../data.dart';
import 'ui.dart';

Widget _grabber(Palette pal) => Center(
      child: Container(width: 38, height: 4, margin: const EdgeInsets.only(bottom: 16), decoration: BoxDecoration(color: pal.line, borderRadius: BorderRadius.circular(30))),
    );

void showPropertySheet(BuildContext context) {
  final s = context.store;
  final pal = s.pal;
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (_) => Directionality(
      textDirection: s.dir,
      child: Container(
        decoration: BoxDecoration(color: pal.card, borderRadius: const BorderRadius.vertical(top: Radius.circular(24))),
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _grabber(pal),
            Text(s.isAr ? 'اختر نوع العقار' : 'Select property type', style: t800(17, pal.ink)),
            const SizedBox(height: 16),
            ...List.generate(s.pt().length, (i) {
              final active = i == s.ptIdx;
              final mult = (s.t['pm'] as List)[i] as String;
              final soft = i < 2;
              return Padding(
                padding: const EdgeInsets.only(bottom: 9),
                child: GestureDetector(
                  onTap: () {
                    s.selectProperty(i);
                    Navigator.pop(context);
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: active ? kPrimary.withValues(alpha: .08) : pal.card,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: active ? kPrimary : pal.line, width: 1.5),
                    ),
                    child: Row(children: [
                      Text(kPropEmoji[i], style: const TextStyle(fontSize: 22)),
                      const SizedBox(width: 11),
                      Expanded(child: Text(s.pt()[i], style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: active ? kPrimary : pal.ink))),
                      Pill(mult, soft ? pal.field : kAmber.withValues(alpha: .15), soft ? pal.muted : kAmber2, fontSize: 10.5),
                    ]),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    ),
  );
}

void showFilterSheet(BuildContext context) {
  final s = context.store;
  final pal = s.pal;
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (_) => StatefulBuilder(
      builder: (ctx, setSheet) {
        Widget chip(String label, bool active, VoidCallback onTap) => GestureDetector(
              onTap: () {
                onTap();
                setSheet(() {});
              },
              behavior: HitTestBehavior.opaque,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 7),
                decoration: BoxDecoration(
                  color: active ? kPrimary : pal.card,
                  borderRadius: BorderRadius.circular(30),
                  border: active ? null : Border.all(color: pal.line),
                ),
                child: Text(label, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: active ? Colors.white : pal.soft)),
              ),
            );
        Widget section(String title, List<Widget> chips) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                Text(title.toUpperCase(), style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: pal.soft, letterSpacing: .4)),
                const SizedBox(height: 9),
                Wrap(spacing: 8, runSpacing: 8, children: chips),
              ],
            );
        final dates = [
          ['today', s.isAr ? 'اليوم' : 'Today'],
          ['week', s.isAr ? 'هذا الأسبوع' : 'This week'],
          ['month', s.isAr ? 'هذا الشهر' : 'This month'],
        ];
        return Directionality(
          textDirection: s.dir,
          child: Container(
            decoration: BoxDecoration(color: pal.card, borderRadius: const BorderRadius.vertical(top: Radius.circular(24))),
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _grabber(pal),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(s.isAr ? 'تصفية النتائج' : 'Filter results', style: t800(17, pal.ink)),
                  GestureDetector(onTap: () { s.resetFilter(); setSheet(() {}); }, child: Text(s.isAr ? 'إعادة' : 'Reset', style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: kPrimary))),
                ]),
                section(s.isAr ? 'التاريخ' : 'Date', [for (final d in dates) chip(d[1], s.dashDate == d[0], () => s.setDashDate(d[0]))]),
                section(s.t['manageServices'], [
                  chip(s.isAr ? 'كل الخدمات' : 'All services', s.dashSvc == 'all', () => s.setDashSvc('all')),
                  for (final sv in s.cServices) chip(s.ct()[sv.typeIdx], s.dashSvc == sv.typeIdx.toString(), () => s.setDashSvc(sv.typeIdx.toString())),
                ]),
                section(s.isAr ? 'الطاقم' : 'Staff', [
                  chip(s.isAr ? 'كل الطاقم' : 'All staff', s.dashStaff == 'all', () => s.setDashStaff('all')),
                  for (final st in s.staff) chip(st.name.split(' ').first, s.dashStaff == st.name, () => s.setDashStaff(st.name)),
                ]),
                const SizedBox(height: 22),
                PrimaryButton(s.isAr ? 'تطبيق' : 'Apply results', () => Navigator.pop(context)),
              ],
            ),
          ),
        );
      },
    ),
  );
}
