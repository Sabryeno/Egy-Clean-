import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets/ui.dart';

// ---------- shared field ----------
class _Field extends StatelessWidget {
  final String label;
  final String? hint;
  final bool obscure;
  final TextEditingController? controller;
  const _Field({required this.label, this.hint, this.obscure = false, this.controller});
  @override
  Widget build(BuildContext context) {
    final pal = context.pal;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: pal.soft)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: obscure,
          style: TextStyle(fontSize: 14, color: pal.ink),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: pal.muted, fontWeight: FontWeight.w500),
            filled: true,
            fillColor: pal.field,
            contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: pal.line)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: kPrimary, width: 1.4)),
          ),
        ),
      ],
    );
  }
}

Widget _segmented(BuildContext context) {
  final s = context.store;
  final pal = context.pal;
  Widget seg(String label, bool active, VoidCallback onTap) => Expanded(
        child: GestureDetector(
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 11),
            alignment: Alignment.center,
            decoration: BoxDecoration(color: active ? kPrimary : Colors.transparent, borderRadius: BorderRadius.circular(11)),
            child: Text(label, style: TextStyle(fontWeight: active ? FontWeight.w800 : FontWeight.w700, fontSize: 13, color: active ? Colors.white : pal.soft)),
          ),
        ),
      );
  return Container(
    padding: const EdgeInsets.all(4),
    decoration: BoxDecoration(color: pal.field, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
    child: Row(children: [
      seg('👤 ${s.t['individual']}', s.acct == Acct.individual, () => s.pickAcct(Acct.individual)),
      seg('🏢 ${s.t['corporate']}', s.acct == Acct.corporate, () => s.pickAcct(Acct.corporate)),
    ]),
  );
}

// ---------- SPLASH ----------
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _ring = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800))..repeat();
  @override
  void dispose() {
    _ring.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    return Container(
      decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF1E63FF), Color(0xFF1546C0)])),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 140,
              height: 140,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  AnimatedBuilder(
                    animation: _ring,
                    builder: (_, _) => Container(
                      width: 120 * (0.6 + _ring.value * 1.8),
                      height: 120 * (0.6 + _ring.value * 1.8),
                      decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: (0.35 * (1 - _ring.value)).clamp(0, 1))),
                    ),
                  ),
                  TweenAnimationBuilder<double>(
                    tween: Tween(begin: 0.5, end: 1),
                    duration: const Duration(milliseconds: 900),
                    curve: Curves.elasticOut,
                    builder: (_, v, child) => Transform.scale(scale: v, child: child),
                    child: Container(
                      width: 104,
                      height: 104,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30)),
                      child: const Text('🧼', style: TextStyle(fontSize: 52)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 26),
            Text(s.t['appName'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 28, letterSpacing: -0.5)),
            const SizedBox(height: 8),
            Text(s.t['tagline'], style: TextStyle(color: Colors.white.withValues(alpha: .85), fontWeight: FontWeight.w500, fontSize: 13.5)),
          ],
        ),
      ),
    );
  }
}

// ---------- LOGIN (eased) ----------
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final pass = TextEditingController(text: 'demo1234');
  @override
  void dispose() {
    email.dispose();
    pass.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    // keep the demo email in sync with the selected role
    final demoEmail = s.acct == Acct.corporate ? 'ops@sparklemasr.com' : 'rana@email.com';
    if (email.text.isEmpty || email.text == 'rana@email.com' || email.text == 'ops@sparklemasr.com') {
      email.text = demoEmail;
    }
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 8, 24, 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(
              alignment: AlignmentDirectional.centerEnd,
              child: ChipButton(s.isAr ? 'EN' : 'عربي', s.toggleLang, bg: pal.field, fg: pal.ink),
            ),
            const SizedBox(height: 10),
            Center(child: MonoAvatar('🧼', size: 70, radius: 20, font: 34, gradient: gradFrom(const [kPrimary, kPrimaryDark]))),
            const SizedBox(height: 18),
            Center(child: Text(s.t['welcomeBack'], style: t800(24, pal.ink))),
            const SizedBox(height: 5),
            Center(child: Text(s.t['loginSub'], style: t500(13, pal.soft), textAlign: TextAlign.center)),
            const SizedBox(height: 22),
            _segmented(context),
            const SizedBox(height: 16),
            // demo hint
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
              decoration: BoxDecoration(color: kPrimary.withValues(alpha: .08), borderRadius: BorderRadius.circular(12), border: Border.all(color: kPrimary.withValues(alpha: .2))),
              child: Row(children: [
                const Text('✨', style: TextStyle(fontSize: 15)),
                const SizedBox(width: 9),
                Expanded(child: Text(s.t['demoHint'], style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: pal.soft))),
              ]),
            ),
            const SizedBox(height: 16),
            _Field(label: s.t['email'], controller: email),
            const SizedBox(height: 14),
            _Field(label: s.t['password'], controller: pass, obscure: true),
            const SizedBox(height: 22),
            PrimaryButton(s.t['continueWord'], s.doLogin),
            const SizedBox(height: 18),
            // quick-access divider
            Row(children: [
              Expanded(child: Divider(color: pal.line)),
              Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text(s.t['quickAccess'], style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: pal.muted))),
              Expanded(child: Divider(color: pal.line)),
            ]),
            const SizedBox(height: 14),
            Row(children: [
              Expanded(child: _quickBtn(context, '👤', s.t['enterAsCustomer'], s.quickCustomer)),
              const SizedBox(width: 11),
              Expanded(child: _quickBtn(context, '🏢', s.t['enterAsCompany'], s.quickCompany)),
            ]),
            const SizedBox(height: 18),
            Center(
              child: Text.rich(TextSpan(children: [
                TextSpan(text: '${s.t['noAccount']} ', style: t500(13, pal.soft)),
                WidgetSpan(
                  child: GestureDetector(onTap: () => s.go(Screen.signup), child: Text(s.t['createAccount'], style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w700, fontSize: 13))),
                ),
              ])),
            ),
          ],
        ),
      ),
    );
  }

  Widget _quickBtn(BuildContext context, String emoji, String label, VoidCallback onTap) {
    final pal = context.pal;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(color: pal.card, borderRadius: BorderRadius.circular(14), border: Border.all(color: pal.line)),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text(emoji, style: const TextStyle(fontSize: 22)),
          const SizedBox(height: 6),
          Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: pal.ink)),
        ]),
      ),
    );
  }
}

// ---------- SIGNUP ----------
class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    final corp = s.acct == Acct.corporate;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 6, 24, 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(alignment: AlignmentDirectional.centerStart, child: BackCircle(onTap: () => s.go(Screen.login), bg: pal.field, icon: pal.ink)),
            const SizedBox(height: 14),
            Text(s.t['createAccount'], style: t800(24, pal.ink)),
            const SizedBox(height: 5),
            Text(s.t['signupSub'], style: t500(13, pal.soft)),
            const SizedBox(height: 20),
            _segmented(context),
            const SizedBox(height: 18),
            _Field(label: corp ? s.t['companyName'] : (s.isAr ? 'الاسم الكامل' : 'Full name'), hint: corp ? s.t['companyNamePh'] : (s.isAr ? 'رنا مصطفى' : 'Rana Mostafa')),
            const SizedBox(height: 13),
            _Field(label: s.t['email'], hint: 'name@email.com'),
            const SizedBox(height: 13),
            _Field(label: s.t['mobileNumber'], hint: '+20 1XX XXX XXXX'),
            const SizedBox(height: 22),
            PrimaryButton(corp ? (s.isAr ? 'متابعة' : 'Continue') : s.t['createAccount'], s.doSignup),
            const SizedBox(height: 16),
            Center(
              child: Text.rich(TextSpan(children: [
                TextSpan(text: '${s.t['haveAccount']} ', style: t500(13, pal.soft)),
                WidgetSpan(child: GestureDetector(onTap: () => s.go(Screen.login), child: Text(s.t['login'], style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w700, fontSize: 13)))),
              ])),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------- CORP REGISTRATION ----------
class CorpRegScreen extends StatelessWidget {
  const CorpRegScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    Widget upload(String which, String icon, String label, bool done) => GestureDetector(
          onTap: () => s.setUpload(which),
          behavior: HitTestBehavior.opaque,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 14),
            decoration: BoxDecoration(
              color: done ? kGreen.withValues(alpha: .08) : pal.field,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: done ? kGreen.withValues(alpha: .4) : pal.line, width: 1.5),
            ),
            child: Row(children: [
              Container(width: 40, height: 40, alignment: Alignment.center, decoration: BoxDecoration(color: done ? kGreen.withValues(alpha: .15) : kPrimary.withValues(alpha: .1), borderRadius: BorderRadius.circular(10)), child: Text(icon, style: const TextStyle(fontSize: 19))),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(label, style: t700(13, pal.ink)),
                const SizedBox(height: 1),
                Text(done ? s.t['uploaded'] : s.t['tapUpload'], style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: done ? kGreen2 : pal.muted)),
              ])),
              done ? const Icon(Icons.check_circle, color: kGreen, size: 22) : const Text('＋', style: TextStyle(color: kPrimary, fontSize: 20, fontWeight: FontWeight.w800)),
            ]),
          ),
        );
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(22, 6, 22, 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(alignment: AlignmentDirectional.centerStart, child: BackCircle(onTap: () => s.go(Screen.signup), bg: pal.field, icon: pal.ink)),
            const SizedBox(height: 14),
            Text(s.t['corpRegTitle'], style: t800(22, pal.ink)),
            const SizedBox(height: 5),
            Text(s.t['corpRegSub'], style: t500(12.5, pal.soft)),
            const SizedBox(height: 18),
            _Field(label: s.t['companyName'], hint: s.t['companyNamePh']),
            const SizedBox(height: 12),
            upload('lic', '📄', s.t['tradeLicence'], s.upLic),
            const SizedBox(height: 12),
            upload('id', '🪪', s.t['ownerId'], s.upId),
            const SizedBox(height: 12),
            _Field(label: s.t['mobileNumber'], hint: '+20 1XX XXX XXXX'),
            const SizedBox(height: 12),
            _Field(label: s.t['supportNumber'], hint: s.t['supportPh']),
            const SizedBox(height: 20),
            PrimaryButton(s.t['submitReview'], s.submitReview),
          ],
        ),
      ),
    );
  }
}

// ---------- UNDER REVIEW ----------
class ReviewScreen extends StatelessWidget {
  const ReviewScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = context.store;
    final pal = context.pal;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(28, 40, 28, 28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 30),
            Center(
              child: Container(
                width: 110, height: 110, alignment: Alignment.center,
                decoration: BoxDecoration(color: kAmber.withValues(alpha: .14), shape: BoxShape.circle),
                child: const Text('📋', style: TextStyle(fontSize: 52)),
              ),
            ),
            const SizedBox(height: 24),
            Text(s.t['reviewTitle'], textAlign: TextAlign.center, style: t800(23, pal.ink)),
            const SizedBox(height: 8),
            Text(s.t['reviewBody'], textAlign: TextAlign.center, style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w500, color: pal.soft, height: 1.6)),
            const SizedBox(height: 24),
            SoftCard(
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('💡', style: TextStyle(fontSize: 18)),
                const SizedBox(width: 11),
                Expanded(child: Text(s.t['reviewNote'], style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: pal.soft, height: 1.5))),
              ]),
            ),
            const Spacer(),
            PrimaryButton(s.t['simulateApprove'], s.simulateApprove, color: kGreen),
            const SizedBox(height: 11),
            Center(child: GestureDetector(onTap: s.enterLimited, child: Text(s.t['continueLimited'], style: const TextStyle(color: kPrimary, fontWeight: FontWeight.w700, fontSize: 13)))),
          ],
        ),
      ),
    );
  }
}
