import 'package:flutter/material.dart';
import '../store.dart';
import '../theme.dart';

/// Exposes the AppStore and rebuilds dependents whenever it notifies.
class AppScope extends InheritedNotifier<AppStore> {
  const AppScope({super.key, required AppStore store, required super.child})
      : super(notifier: store);
  static AppStore of(BuildContext c) => c.dependOnInheritedWidgetOfExactType<AppScope>()!.notifier!;
}

extension StoreX on BuildContext {
  AppStore get store => AppScope.of(this);
  Palette get pal => AppScope.of(this).pal;
}

// ---- text helpers ----
TextStyle t800(double s, Color c) => TextStyle(fontSize: s, fontWeight: FontWeight.w800, color: c, letterSpacing: -0.3, height: 1.15);
TextStyle t700(double s, Color c) => TextStyle(fontSize: s, fontWeight: FontWeight.w700, color: c, height: 1.2);
TextStyle t600(double s, Color c) => TextStyle(fontSize: s, fontWeight: FontWeight.w600, color: c, height: 1.2);
TextStyle t500(double s, Color c) => TextStyle(fontSize: s, fontWeight: FontWeight.w500, color: c, height: 1.3);

/// Soft white card with hairline border (design's core surface).
class SoftCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final Color? color;
  final Color? border;
  final VoidCallback? onTap;
  const SoftCard({super.key, required this.child, this.padding = const EdgeInsets.all(15), this.radius = 16, this.color, this.border, this.onTap});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    final box = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? pal.card,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: border ?? pal.line, width: 1),
      ),
      child: child,
    );
    if (onTap == null) return box;
    return GestureDetector(onTap: onTap, behavior: HitTestBehavior.opaque, child: box);
  }
}

class Pill extends StatelessWidget {
  final String label;
  final Color bg, fg;
  final double fontSize;
  const Pill(this.label, this.bg, this.fg, {super.key, this.fontSize = 10.5});
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(30)),
        child: Text(label, style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w800, color: fg)),
      );
}

class MonoAvatar extends StatelessWidget {
  final String text;
  final double size, radius, font;
  final Gradient? gradient;
  final Color? color;
  final Color textColor;
  const MonoAvatar(this.text, {super.key, this.size = 46, this.radius = 12, this.font = 20, this.gradient, this.color, this.textColor = Colors.white});
  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: BoxDecoration(gradient: gradient, color: color, borderRadius: BorderRadius.circular(radius)),
        child: Text(text, style: TextStyle(color: textColor, fontWeight: FontWeight.w800, fontSize: font)),
      );
}

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  final bool enabled;
  final Color color;
  final double fontSize;
  const PrimaryButton(this.label, this.onTap, {super.key, this.enabled = true, this.color = kPrimary, this.fontSize = 15});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    return GestureDetector(
      onTap: enabled ? onTap : null,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: enabled ? color : pal.line,
          borderRadius: BorderRadius.circular(14),
          boxShadow: enabled && color == kPrimary ? [BoxShadow(color: kPrimary.withValues(alpha: .45), blurRadius: 18, offset: const Offset(0, 8))] : null,
        ),
        child: Text(label, textAlign: TextAlign.center, style: TextStyle(color: enabled ? Colors.white : pal.muted, fontWeight: FontWeight.w800, fontSize: fontSize)),
      ),
    );
  }
}

class SectionLabel extends StatelessWidget {
  final String text;
  final bool caps;
  const SectionLabel(this.text, {super.key, this.caps = false});
  @override
  Widget build(BuildContext context) => Text(caps ? text.toUpperCase() : text,
      style: TextStyle(fontSize: caps ? 13 : 13, fontWeight: FontWeight.w800, color: context.pal.soft, letterSpacing: caps ? .4 : 0));
}

/// Circular back button whose chevron mirrors under RTL.
class BackCircle extends StatelessWidget {
  final VoidCallback onTap;
  final Color bg;
  final Color icon;
  const BackCircle({super.key, required this.onTap, required this.bg, required this.icon});
  @override
  Widget build(BuildContext context) {
    final ar = context.store.isAr;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 36,
        height: 36,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
        child: Transform.scale(
          scaleX: ar ? -1 : 1,
          child: Icon(Icons.arrow_back_ios_new, size: 16, color: icon),
        ),
      ),
    );
  }
}

/// Round +/- stepper button.
class RoundStep extends StatelessWidget {
  final String label;
  final bool primary;
  final VoidCallback onTap;
  final double size;
  const RoundStep(this.label, this.primary, this.onTap, {super.key, this.size = 36});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: primary ? kPrimary : pal.field,
          shape: BoxShape.circle,
          border: primary ? null : Border.all(color: pal.line),
        ),
        child: Text(label, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: primary ? Colors.white : pal.ink)),
      ),
    );
  }
}

/// Small language / theme chip button.
class ChipButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Color bg, fg;
  const ChipButton(this.label, this.onTap, {super.key, this.bg = const Color(0x28FFFFFF), this.fg = Colors.white});
  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Container(
          height: 34,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(30)),
          child: Text(label, style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: fg)),
        ),
      );
}

/// A simple map placeholder (grid + pin), matching the design's static map.
class MapPlaceholder extends StatelessWidget {
  final double height;
  final String? caption;
  const MapPlaceholder({super.key, this.height = 104, this.caption});
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: Container(
        height: height,
        decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFFDFE8F5), Color(0xFFEEF3FA)])),
        child: Stack(
          children: [
            CustomPaint(size: Size.infinite, painter: _GridPainter()),
            const Align(alignment: Alignment(0, -0.15), child: Text('📍', style: TextStyle(fontSize: 28))),
            if (caption != null)
              Positioned(
                left: 8,
                bottom: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                  decoration: BoxDecoration(color: Colors.white.withValues(alpha: .9), borderRadius: BorderRadius.circular(8)),
                  child: Text(caption!, style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: kPrimaryDark)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = kPrimary.withValues(alpha: .08)..strokeWidth = 1;
    for (double x = 0; x < size.width; x += 24) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), p);
    }
    for (double y = 0; y < size.height; y += 24) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), p);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
