import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import 'ui.dart';

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;
  final bool showDot;
  const _NavItem(this.icon, this.label, this.active, this.onTap, {this.showDot = false});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    final color = active ? kPrimary : pal.navicon;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(icon, size: 22, color: color),
                if (showDot)
                  Positioned(right: -3, top: -2, child: Container(width: 8, height: 8, decoration: const BoxDecoration(color: kAmber, shape: BoxShape.circle))),
              ],
            ),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 10.5, fontWeight: active ? FontWeight.w700 : FontWeight.w600, color: color)),
          ],
        ),
      ),
    );
  }
}

Widget bottomNav(BuildContext context) {
  final s = context.store;
  final pal = context.pal;
  final children = s.app == AppMode.company
      ? [
          _NavItem(Icons.grid_view_rounded, s.t['navDashboard'], s.screen == Screen.cHome, () => s.go(Screen.cHome)),
          _NavItem(Icons.receipt_long_rounded, s.t['navServices'], s.screen == Screen.cServices, () => s.go(Screen.cServices)),
          _NavItem(Icons.history_rounded, s.t['navHistory'], s.screen == Screen.cHistory, () => s.go(Screen.cHistory)),
          _NavItem(Icons.notifications_none_rounded, s.t['navAlerts'], s.screen == Screen.cNotifs, () => s.go(Screen.cNotifs), showDot: s.compUnread > 0),
          _NavItem(Icons.badge_outlined, s.t['navProfile'], s.screen == Screen.cProfile, () => s.go(Screen.cProfile)),
        ]
      : [
          _NavItem(Icons.home_outlined, s.t['navHome'], s.screen == Screen.home, () => s.go(Screen.home)),
          _NavItem(Icons.search_rounded, s.t['navSearch'], s.screen == Screen.search, () => s.go(Screen.search)),
          _NavItem(Icons.event_note_outlined, s.t['navBookings'], s.screen == Screen.bookings, () => s.go(Screen.bookings)),
          _NavItem(Icons.person_outline_rounded, s.t['navProfile'], s.screen == Screen.account, () => s.go(Screen.account)),
        ];
  return Container(
    decoration: BoxDecoration(color: pal.card, border: Border(top: BorderSide(color: pal.line))),
    padding: const EdgeInsets.only(top: 10, bottom: 12, left: 8, right: 8),
    child: SafeArea(top: false, child: Row(children: children)),
  );
}

/// Sticky estimated-total bar for the booking steps.
Widget estBar(BuildContext context, String btnLabel, VoidCallback onTap) {
  final s = context.store;
  final pal = context.pal;
  return Container(
    decoration: BoxDecoration(color: pal.card, border: Border(top: BorderSide(color: pal.line))),
    padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
    child: SafeArea(
      top: false,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text((s.t['estTotal'] as String).toUpperCase(), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: pal.muted, letterSpacing: .4)),
                const SizedBox(height: 2),
                Text(s.fmt(s.price().total), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: kPrimary)),
              ],
            ),
          ),
          GestureDetector(
            onTap: onTap,
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 15),
              decoration: BoxDecoration(color: kPrimary, borderRadius: BorderRadius.circular(14), boxShadow: [BoxShadow(color: kPrimary.withValues(alpha: .45), blurRadius: 18, offset: const Offset(0, 8))]),
              child: Text(btnLabel, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 15)),
            ),
          ),
        ],
      ),
    ),
  );
}

/// A single-button sticky bar (vendor / summary / payment).
Widget stickyButtonBar(BuildContext context, Widget button) {
  final pal = context.pal;
  return Container(
    decoration: BoxDecoration(color: pal.card, border: Border(top: BorderSide(color: pal.line))),
    padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
    child: SafeArea(top: false, child: button),
  );
}
