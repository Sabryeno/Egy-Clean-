import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../data.dart';
import '../widgets/ui.dart';
import '../widgets/sheets.dart';

// ================= HOME =================
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final upcoming = s.bookings.where((b) => b.status == 'upcoming').toList();
    final topRated = [kCompanies[3], kCompanies[0]];

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        // gradient header
        Container(
          padding: EdgeInsets.fromLTRB(20, top + 6, 20, 24),
          decoration: const BoxDecoration(
            gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [kPrimary, kPrimaryDark]),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(26)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(s.t['greeting'], style: TextStyle(fontSize: 12.5, color: Colors.white.withValues(alpha: .8), fontWeight: FontWeight.w500)),
                      const SizedBox(height: 2),
                      Text('${s.t['userName']} 👋', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                    ]),
                  ),
                  ChipButton(s.isAr ? 'EN' : 'عربي', s.toggleLang),
                  const SizedBox(width: 8),
                  _bell(context, s.custUnread > 0, () => s.go(Screen.custNotifs)),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: .14), borderRadius: BorderRadius.circular(16)),
                child: Row(children: [
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(s.t['walletBalance'], style: TextStyle(fontSize: 11.5, color: Colors.white.withValues(alpha: .82), fontWeight: FontWeight.w600)),
                      const SizedBox(height: 2),
                      Text(s.fmt(450), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                    ]),
                  ),
                  GestureDetector(
                    onTap: () => s.go(Screen.search),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30)),
                      child: Text('＋ ${s.t['quickBook']}', style: const TextStyle(color: kPrimaryDark, fontWeight: FontWeight.w800, fontSize: 13)),
                    ),
                  ),
                ]),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: () => s.go(Screen.search),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                  child: Row(children: [
                    const Icon(Icons.search_rounded, color: kPrimary, size: 20),
                    const SizedBox(width: 10),
                    Text(s.t['searchPh'], style: const TextStyle(color: Color(0xFF8A93A3), fontSize: 13.5, fontWeight: FontWeight.w500)),
                  ]),
                ),
              ),
            ],
          ),
        ),
        // upcoming
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _sectionRow(context, s.t['upcoming'], () => s.go(Screen.bookings)),
            const SizedBox(height: 10),
            if (upcoming.isNotEmpty) _upcomingCard(context, upcoming.first),
          ]),
        ),
        // services
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(s.t['services'], style: t800(15, pal.ink)),
            const SizedBox(height: 11),
            Row(children: [
              _serviceTile(context, '🧹', s.ct()[0]),
              _serviceTile(context, '🫧', s.ct()[1]),
              _serviceTile(context, '🛋️', s.ct()[3]),
              _serviceTile(context, '🪟', s.isAr ? 'نوافذ' : 'Windows'),
            ]),
          ]),
        ),
        // top rated
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _sectionRow(context, s.t['topRated'], () => s.go(Screen.search)),
            const SizedBox(height: 11),
            for (final c in topRated) ...[
              _companyRow(context, c, kCompanies.indexOf(c)),
              const SizedBox(height: 12),
            ],
          ]),
        ),
      ],
    );
  }

  Widget _bell(BuildContext context, bool dot, VoidCallback onTap) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 34, height: 34, alignment: Alignment.center,
          decoration: BoxDecoration(color: Colors.white.withValues(alpha: .16), shape: BoxShape.circle),
          child: Stack(clipBehavior: Clip.none, alignment: Alignment.center, children: [
            const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 18),
            if (dot) Positioned(right: 6, top: 6, child: Container(width: 7, height: 7, decoration: BoxDecoration(color: kAmber, shape: BoxShape.circle, border: Border.all(color: kPrimaryDark, width: 1.5)))),
          ]),
        ),
      );

  Widget _sectionRow(BuildContext context, String title, VoidCallback onAll) {
    final s = context.store;
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Expanded(child: Text(title, style: t800(15, context.pal.ink))),
      GestureDetector(onTap: onAll, child: Text(s.t['viewAll'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kPrimary))),
    ]);
  }

  Widget _upcomingCard(BuildContext context, Booking b) {
    final s = context.store;
    final pal = context.pal;
    return SoftCard(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          MonoAvatar(b.mono, size: 44, radius: 11, font: 19, gradient: gradFrom(b.grad)),
          const SizedBox(width: 11),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(b.name, style: t800(14.5, pal.ink)),
            const SizedBox(height: 1),
            Text(b.service, style: t500(11.5, pal.soft)),
          ])),
          Pill(s.t['upcomingBadge'], kPrimary.withValues(alpha: .1), kPrimaryDark),
        ]),
        const SizedBox(height: 12),
        Divider(height: 1, color: pal.line2),
        const SizedBox(height: 12),
        Row(children: [
          const Icon(Icons.access_time_rounded, size: 15, color: kPrimary),
          const SizedBox(width: 8),
          Text(b.datetime, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: pal.soft)),
        ]),
      ]),
    );
  }

  Widget _serviceTile(BuildContext context, String emoji, String label) {
    final pal = context.pal;
    return Expanded(
      child: Container(
        margin: const EdgeInsetsDirectional.only(end: 10),
        padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 4),
        decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
        child: Column(children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(height: 6),
          Text(label, textAlign: TextAlign.center, maxLines: 2, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: pal.ink)),
        ]),
      ),
    );
  }

  Widget _companyRow(BuildContext context, CompanyDef c, int index) {
    final s = context.store;
    final pal = context.pal;
    return SoftCard(
      padding: const EdgeInsets.all(12),
      onTap: () => s.openVendor(index),
      child: Row(children: [
        MonoAvatar(c.mono, size: 52, radius: 13, font: 22, gradient: gradFrom(c.grad)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(c.name[s.lang]!, style: t800(14.5, pal.ink)),
          const SizedBox(height: 2),
          Text(c.tag[s.lang]!, style: t500(11.5, pal.soft), maxLines: 1, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 5),
          Text('⭐ ${c.rating} · ${c.dist} ${s.t['km']}', style: const TextStyle(fontSize: 11, color: kAmber2, fontWeight: FontWeight.w700)),
        ])),
        const SizedBox(width: 8),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(s.fmt(c.base), style: t800(13.5, pal.ink)),
          Text(s.t['perHour'], style: TextStyle(fontSize: 10.5, color: pal.muted, fontWeight: FontWeight.w600)),
        ]),
      ]),
    );
  }
}

// ================= SEARCH =================
class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final filters = s.isAr
        ? ['الأقرب', 'الأرخص', 'الأعلى تقييماً', 'متاح اليوم', 'الأدوات', 'فوري']
        : ['Nearest', 'Lowest price', 'Top rated', 'Available', 'Tools', 'Instant'];
    final top = MediaQuery.of(context).padding.top;
    return ListView(
      padding: EdgeInsets.fromLTRB(20, top + 8, 20, 20),
      children: [
        Text(s.t['searchTitle'], style: t800(20, pal.ink)),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 3),
          decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
          child: Row(children: [
            const Icon(Icons.search_rounded, color: kPrimary, size: 20),
            const SizedBox(width: 10),
            Expanded(child: TextField(
              onChanged: (v) => s.searchQuery = v,
              decoration: InputDecoration(border: InputBorder.none, hintText: s.t['searchPh'], hintStyle: TextStyle(color: pal.muted, fontSize: 13.5, fontWeight: FontWeight.w500)),
              style: TextStyle(fontSize: 14, color: pal.ink),
            )),
          ]),
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 34,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: filters.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (_, i) {
              final active = i == s.activeFilter;
              return GestureDetector(
                onTap: () => s.setActiveFilter(i),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 13),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: active ? kPrimary : pal.card,
                    borderRadius: BorderRadius.circular(30),
                    border: active ? null : Border.all(color: pal.line),
                  ),
                  child: Text(filters[i], style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: active ? Colors.white : pal.soft)),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 18),
        Text('${kCompanies.length} ${s.t['results']}', style: t800(13, pal.soft)),
        const SizedBox(height: 12),
        for (int i = 0; i < kCompanies.length; i++) ...[
          _resultCard(context, kCompanies[i], i),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _resultCard(BuildContext context, CompanyDef c, int index) {
    final s = context.store;
    final pal = context.pal;
    return GestureDetector(
      onTap: () => s.openVendor(index),
      child: Container(
        decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(16), border: Border.all(color: pal.line)),
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Stack(children: [
                MonoAvatar(c.mono, size: 70, radius: 12, font: 26, gradient: gradFrom(c.grad)),
                Positioned(bottom: 5, left: 5, child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: Colors.black.withValues(alpha: .4), borderRadius: BorderRadius.circular(30)),
                  child: Text('⭐ ${c.rating}', style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.w700)),
                )),
              ]),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(child: Text(c.name[s.lang]!, style: t800(14.5, pal.ink))),
                  Text('${c.dist} ${s.t['km']}', style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
                ]),
                const SizedBox(height: 2),
                Text(c.tag[s.lang]!, style: t500(11.5, pal.soft)),
                const SizedBox(height: 8),
                Wrap(spacing: 5, runSpacing: 5, children: [
                  for (final code in c.tags) () { final t = s.tagChip(code); return Pill(t.label, t.bg, t.fg, fontSize: 10); }(),
                ]),
              ])),
            ]),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(color: pal.field, borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)), border: Border(top: BorderSide(color: pal.line2))),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text.rich(TextSpan(children: [
                TextSpan(text: '${s.t['from']} ', style: TextStyle(fontSize: 12, color: pal.muted, fontWeight: FontWeight.w600)),
                TextSpan(text: s.fmt(c.base), style: TextStyle(fontSize: 14, color: pal.ink, fontWeight: FontWeight.w800)),
                TextSpan(text: ' ${s.t['perHour']}', style: TextStyle(fontSize: 12, color: pal.muted, fontWeight: FontWeight.w600)),
              ])),
              Container(padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 7), decoration: BoxDecoration(color: kPrimary, borderRadius: BorderRadius.circular(30)), child: Text(s.t['bookNow'], style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700))),
            ]),
          ),
        ]),
      ),
    );
  }
}

// ================= VENDOR =================
class VendorScreen extends StatelessWidget {
  const VendorScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final c = s.company;
    final top = MediaQuery.of(context).padding.top;
    final services = s.isAr ? ['تنظيف عميق', 'مطابخ', 'حمامات', 'نوافذ', 'كنب', 'سجاد'] : ['Deep clean', 'Kitchens', 'Bathrooms', 'Windows', 'Sofas', 'Carpets'];
    final gallery = [['🛋️', 0xFFEAF0FF], ['🍽️', 0xFFE7F8EF], ['🚿', 0xFFFFF4E0], ['🪟', 0xFFF0E9FF]];
    Widget stat(String v, String label) => Expanded(child: Container(
          padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 8),
          decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
          child: Column(children: [Text(v, style: t800(17, pal.ink)), const SizedBox(height: 2), Text(label, style: TextStyle(fontSize: 10.5, color: pal.muted, fontWeight: FontWeight.w600))]),
        ));
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Container(
          padding: EdgeInsets.fromLTRB(20, top + 4, 20, 26),
          decoration: BoxDecoration(gradient: gradFrom(c.grad), borderRadius: const BorderRadius.vertical(bottom: Radius.circular(26))),
          child: Column(children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              BackCircle(onTap: () => s.go(Screen.search), bg: Colors.white.withValues(alpha: .18), icon: Colors.white),
              Container(width: 36, height: 36, alignment: Alignment.center, decoration: BoxDecoration(color: Colors.white.withValues(alpha: .18), shape: BoxShape.circle), child: const Icon(Icons.favorite_border_rounded, color: Colors.white, size: 18)),
            ]),
            const SizedBox(height: 6),
            Text(c.hero, style: const TextStyle(fontSize: 46)),
            const SizedBox(height: 6),
            MonoAvatar(c.mono, size: 64, radius: 18, font: 28, color: Colors.white, textColor: kPrimaryDark),
            const SizedBox(height: 10),
            Text(c.name[s.lang]!, style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: Colors.white)),
            const SizedBox(height: 3),
            Text(c.tag[s.lang]!, style: TextStyle(fontSize: 12.5, color: Colors.white.withValues(alpha: .85), fontWeight: FontWeight.w500)),
            const SizedBox(height: 9),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: .18), borderRadius: BorderRadius.circular(30)),
              child: Text('⭐ ${c.rating} · ${c.reviews} ${s.t['reviews']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [stat('6 ${s.t['yrs']}', s.t['experience']), const SizedBox(width: 10), stat(s.fmt(c.base), s.t['fromPrice']), const SizedBox(width: 10), stat(c.dist, s.t['km'])]),
            const SizedBox(height: 16),
            SoftCard(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13), child: Row(children: [
              Container(width: 40, height: 40, alignment: Alignment.center, decoration: BoxDecoration(color: kPrimary.withValues(alpha: .1), borderRadius: BorderRadius.circular(10)), child: const Icon(Icons.location_on, color: kPrimary, size: 20)),
              const SizedBox(width: 11),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(s.t['coverage'], style: t700(13, pal.ink)),
                const SizedBox(height: 1),
                Text(c.coverage[s.lang]!, style: t500(12, pal.soft)),
              ])),
            ])),
            const SizedBox(height: 18),
            Text(s.t['services'], style: t800(14, pal.ink)),
            const SizedBox(height: 10),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (final sv in services) Container(padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 8), decoration: BoxDecoration(color: pal.field, borderRadius: BorderRadius.circular(30), border: Border.all(color: pal.line)), child: Text(sv, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: pal.soft))),
            ]),
            const SizedBox(height: 18),
            Text(s.t['gallery'], style: t800(14, pal.ink)),
            const SizedBox(height: 10),
            SizedBox(height: 96, child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: gallery.length,
              separatorBuilder: (_, _) => const SizedBox(width: 10),
              itemBuilder: (_, i) => Container(width: 120, alignment: Alignment.center, decoration: BoxDecoration(color: Color(gallery[i][1] as int), borderRadius: BorderRadius.circular(14)), child: Text(gallery[i][0] as String, style: const TextStyle(fontSize: 34))),
            )),
            const SizedBox(height: 12),
          ]),
        ),
      ],
    );
  }
}

// ================= CONFIG (step 1/2) =================
class ConfigScreen extends StatelessWidget {
  const ConfigScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    return Column(children: [
      _StepHeader(top: top, step: '1/2', onBack: () => s.go(Screen.vendor), progress: 0.5),
      Expanded(child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
        children: [
          Text(s.t['configTitle'], style: t800(21, pal.ink)),
          const SizedBox(height: 18),
          SectionLabel(s.t['cleaningType'], caps: true),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(children: [
              for (int i = 0; i < s.ct().length; i++) ...[
                if (i > 0) const SizedBox(width: 9),
                GestureDetector(
                  onTap: () => s.selectCleaning(i),
                  child: Container(
                    width: 112,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(color: i == s.ctIdx ? kPrimary.withValues(alpha: .08) : pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: i == s.ctIdx ? kPrimary : pal.line, width: 1.5)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                      Text(kCleaningEmoji[i], style: const TextStyle(fontSize: 22)),
                      const SizedBox(height: 6),
                      Text(s.ct()[i], style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: i == s.ctIdx ? kPrimary : pal.ink)),
                      const SizedBox(height: 2),
                      Text(s.fmt(kRates[i]), style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
                    ]),
                  ),
                ),
              ],
            ]),
          ),
          const SizedBox(height: 18),
          SectionLabel(s.t['propertyType'], caps: true),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () => showPropertySheet(context),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line, width: 1.5)),
              child: Row(children: [
                Text(kPropEmoji[s.ptIdx], style: const TextStyle(fontSize: 22)),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.pt()[s.ptIdx], style: t700(14, pal.ink)),
                  const SizedBox(height: 1),
                  Text(s.isAr ? 'اختر نوع العقار' : 'Select property type', style: TextStyle(fontSize: 11, color: pal.muted, fontWeight: FontWeight.w600)),
                ])),
                () { final soft = s.ptIdx < 2; return Pill((s.t['pm'] as List)[s.ptIdx], soft ? pal.field : kAmber.withValues(alpha: .15), soft ? pal.muted : kAmber2, fontSize: 11); }(),
                const SizedBox(width: 6),
                Icon(Icons.keyboard_arrow_down_rounded, color: pal.muted),
              ]),
            ),
          ),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(child: _stepperBox(context, s.t['hours'], s.hours, s.hoursDec, s.hoursInc)),
            const SizedBox(width: 11),
            Expanded(child: _stepperBox(context, s.t['cleanersUnit'], s.cleaners, s.cleanersDec, s.cleanersInc)),
          ]),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: s.toggleSupplies,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
              decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(16), border: Border.all(color: s.supplies ? kPrimary : pal.line, width: 1.5)),
              child: Row(children: [
                const Text('🧴', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.t['suppliesQ'], style: t700(13.5, pal.ink)),
                  const SizedBox(height: 1),
                  Text('+ ${s.fmt(100)}', style: TextStyle(fontSize: 11.5, color: pal.soft, fontWeight: FontWeight.w600)),
                ])),
                _toggle(s.supplies),
              ]),
            ),
          ),
        ],
      )),
    ]);
  }

  Widget _stepperBox(BuildContext context, String label, int value, VoidCallback dec, VoidCallback inc) {
    final pal = context.pal;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(16), border: Border.all(color: pal.line)),
      child: Column(children: [
        Text(label, style: TextStyle(fontSize: 11.5, color: pal.soft, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          RoundStep('−', false, dec),
          SizedBox(width: 40, child: Text('$value', textAlign: TextAlign.center, style: t800(22, pal.ink))),
          RoundStep('+', true, inc),
        ]),
      ]),
    );
  }

  Widget _toggle(bool on) => Container(
        width: 44, height: 26,
        decoration: BoxDecoration(color: on ? kPrimary : const Color(0xFFD5DBE6), borderRadius: BorderRadius.circular(30)),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 180),
          alignment: on ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(width: 20, height: 20, margin: const EdgeInsets.all(3), decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
        ),
      );
}

// ================= SCHEDULE (step 2/2) =================
class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});
  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  late final TextEditingController addr = TextEditingController(text: context.store.address);
  late final TextEditingController notesC = TextEditingController(text: context.store.notes);
  @override
  void dispose() {
    addr.dispose();
    notesC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final top = MediaQuery.of(context).padding.top;
    final dates = s.dateList();
    final instr = (s.t['instr'] as List).cast<String>();
    return Column(children: [
      _StepHeader(top: top, step: '2/2', onBack: () => s.go(Screen.config), progress: 1),
      Expanded(child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
        children: [
          Text(s.t['scheduleTitle'], style: t800(21, pal.ink)),
          const SizedBox(height: 16),
          SectionLabel(s.t['pickDate'], caps: true),
          const SizedBox(height: 10),
          SizedBox(height: 74, child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: dates.length,
            separatorBuilder: (_, _) => const SizedBox(width: 9),
            itemBuilder: (_, i) {
              final active = i == s.dateIdx;
              final d = dates[i];
              return GestureDetector(
                onTap: () => s.selectDate(i),
                child: Container(
                  width: 58,
                  decoration: BoxDecoration(color: active ? kPrimary : pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: active ? kPrimary : pal.line, width: 1.5)),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text(d.dow, style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: active ? Colors.white.withValues(alpha: .85) : pal.muted)),
                    const SizedBox(height: 3),
                    Text('${d.day}', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: active ? Colors.white : pal.ink)),
                    const SizedBox(height: 2),
                    Text(d.mon, style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: active ? Colors.white.withValues(alpha: .85) : pal.muted)),
                  ]),
                ),
              );
            },
          )),
          const SizedBox(height: 16),
          SectionLabel(s.t['pickTime'], caps: true),
          const SizedBox(height: 10),
          GridView.count(
            crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 9, crossAxisSpacing: 9, childAspectRatio: 2.6,
            children: [
              for (int i = 0; i < kTimes.length; i++) () {
                final active = i == s.timeIdx;
                return GestureDetector(
                  onTap: () => s.selectTime(i),
                  child: Container(
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: active ? kPrimary.withValues(alpha: .1) : pal.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: active ? kPrimary : pal.line, width: 1.5)),
                    child: Text(kTimes[i], style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: active ? kPrimary : pal.ink)),
                  ),
                );
              }(),
            ],
          ),
          const SizedBox(height: 16),
          SectionLabel(s.t['addr'], caps: true),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () { s.useLocation(); addr.text = s.address; },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(color: kPrimary.withValues(alpha: .08), borderRadius: BorderRadius.circular(14), border: Border.all(color: kPrimary.withValues(alpha: .25))),
              child: Row(children: [
                const Icon(Icons.my_location_rounded, size: 17, color: kPrimary),
                const SizedBox(width: 9),
                Text(s.t['useLocation'], style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: kPrimary)),
              ]),
            ),
          ),
          const SizedBox(height: 11),
          MapPlaceholder(caption: s.t['mapsPlaceholder']),
          const SizedBox(height: 11),
          TextField(
            controller: addr,
            onChanged: (v) => s.address = v,
            style: TextStyle(fontSize: 14, color: pal.ink),
            decoration: _inputDec(pal, s.t['addressPh']),
          ),
          const SizedBox(height: 16),
          SectionLabel(s.t['notesK'], caps: true),
          const SizedBox(height: 10),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (int i = 0; i < instr.length; i++) () {
              final on = s.instr.contains(i);
              return GestureDetector(
                onTap: () => s.toggleInstr(i),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 8),
                  decoration: BoxDecoration(color: on ? kPrimary.withValues(alpha: .1) : pal.field, borderRadius: BorderRadius.circular(30), border: Border.all(color: on ? kPrimary : pal.line, width: 1.5)),
                  child: Text('${on ? '✓ ' : ''}${instr[i]}', style: TextStyle(fontSize: 12, fontWeight: on ? FontWeight.w700 : FontWeight.w600, color: on ? kPrimary : pal.soft)),
                ),
              );
            }(),
          ]),
          const SizedBox(height: 10),
          TextField(
            controller: notesC,
            onChanged: (v) => s.notes = v,
            maxLines: 3,
            style: TextStyle(fontSize: 14, color: pal.ink),
            decoration: _inputDec(pal, s.t['notesPh']),
          ),
        ],
      )),
    ]);
  }
}

InputDecoration _inputDec(Palette pal, String hint) => InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: pal.muted, fontWeight: FontWeight.w500),
      filled: true,
      fillColor: pal.field,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: pal.line)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: kPrimary, width: 1.4)),
    );

class _StepHeader extends StatelessWidget {
  final double top;
  final String step;
  final VoidCallback onBack;
  final double progress;
  const _StepHeader({required this.top, required this.step, required this.onBack, required this.progress});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    return Container(
      padding: EdgeInsets.fromLTRB(20, top + 6, 20, 14),
      decoration: BoxDecoration(color: pal.card, border: Border(bottom: BorderSide(color: pal.line))),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          BackCircle(onTap: onBack, bg: pal.field, icon: pal.ink),
          Text('${s.t['step']} $step', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: pal.soft)),
          const SizedBox(width: 36),
        ]),
        const SizedBox(height: 12),
        ClipRRect(
          borderRadius: BorderRadius.circular(30),
          child: LinearProgressIndicator(value: progress, minHeight: 6, backgroundColor: pal.line, valueColor: const AlwaysStoppedAnimation(kPrimary)),
        ),
      ]),
    );
  }
}
