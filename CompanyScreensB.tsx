import 'package:flutter/material.dart';

// ---- Brand colors (from the Egy Cleans design spec) ----
const kPrimary = Color(0xFF1E63FF);
const kPrimaryDark = Color(0xFF1546C0);
const kGreen = Color(0xFF16B364);
const kGreen2 = Color(0xFF0F8B4C);
const kAmber = Color(0xFFF5A623);
const kAmber2 = Color(0xFFB9770E);
const kPurple = Color(0xFF7C3AED);
const kRed = Color(0xFFE5484D);

// Company gradient helpers
const kGradPrimary = LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF1E63FF), Color(0xFF1546C0)]);

LinearGradient gradFrom(List<Color> c) =>
    LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: c);

/// Themeable surface palette — swapped instantly on light/dark toggle.
class Palette {
  final Color bg, card, ink, soft, line, line2, field, muted, navicon;
  const Palette({
    required this.bg,
    required this.card,
    required this.ink,
    required this.soft,
    required this.line,
    required this.line2,
    required this.field,
    required this.muted,
    required this.navicon,
  });

  static const light = Palette(
    bg: Color(0xFFF6F8FC),
    card: Color(0xFFFFFFFF),
    ink: Color(0xFF0E1726),
    soft: Color(0xFF5A6472),
    line: Color(0xFFE6EBF2),
    line2: Color(0xFFEEF2F7),
    field: Color(0xFFF6F8FC),
    muted: Color(0xFF8A93A3),
    navicon: Color(0xFFB4BCCA),
  );

  static const dark = Palette(
    bg: Color(0xFF0B1220),
    card: Color(0xFF131C2E),
    ink: Color(0xFFF2F5FA),
    soft: Color(0xFF97A2B4),
    line: Color(0xFF26324A),
    line2: Color(0xFF1D2941),
    field: Color(0xFF1A2740),
    muted: Color(0xFF6B7890),
    navicon: Color(0xFF55627A),
  );
}
