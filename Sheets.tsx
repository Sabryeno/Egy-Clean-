import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models.dart';
import 'widgets/ui.dart';
import 'widgets/nav.dart';
import 'screens/auth.dart';
import 'screens/customer_a.dart';
import 'screens/customer_b.dart';
import 'screens/company.dart';

const _lightHeaderScreens = {
  Screen.splash, Screen.home, Screen.vendor, Screen.cHome, Screen.cProfile, Screen.custProfile,
};

class RootView extends StatelessWidget {
  const RootView({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.store; // subscribes to store changes
    final pal = s.pal;

    final content = _screenFor(s.screen);
    final bottom = _bottomFor(context);

    final lightIcons = _lightHeaderScreens.contains(s.screen);
    final overlay = (lightIcons)
        ? SystemUiOverlayStyle.light
        : (s.theme == 'dark' ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark);

    return Directionality(
      textDirection: s.dir,
      child: AnnotatedRegion<SystemUiOverlayStyle>(
        value: overlay.copyWith(statusBarColor: Colors.transparent),
        child: Scaffold(
          backgroundColor: pal.bg,
          body: content,
          bottomNavigationBar: bottom,
        ),
      ),
    );
  }

  Widget _screenFor(Screen screen) {
    switch (screen) {
      case Screen.splash: return const SplashScreen();
      case Screen.login: return const LoginScreen();
      case Screen.signup: return const SignupScreen();
      case Screen.corpReg: return const CorpRegScreen();
      case Screen.review: return const ReviewScreen();
      case Screen.home: return const HomeScreen();
      case Screen.search: return const SearchScreen();
      case Screen.vendor: return const VendorScreen();
      case Screen.config: return const ConfigScreen();
      case Screen.schedule: return const ScheduleScreen();
      case Screen.summary: return const SummaryScreen();
      case Screen.payment: return const PaymentScreen();
      case Screen.success: return const SuccessScreen();
      case Screen.bookings: return const BookingsScreen();
      case Screen.account: return const AccountScreen();
      case Screen.custNotifs: return const CustNotifsScreen();
      case Screen.custProfile: return const CustProfileScreen();
      case Screen.cHome: return const CHomeScreen();
      case Screen.cServices: return const CServicesScreen();
      case Screen.cHistory: return const CHistoryScreen();
      case Screen.cNotifs: return const CNotifsScreen();
      case Screen.cProfile: return const CProfileScreen();
      case Screen.cServiceForm: return const CServiceFormScreen();
      case Screen.cStaffForm: return const CStaffFormScreen();
    }
  }

  Widget? _bottomFor(BuildContext context) {
    final s = context.store;
    const custTabs = {Screen.home, Screen.search, Screen.bookings, Screen.account};
    const compTabs = {Screen.cHome, Screen.cServices, Screen.cHistory, Screen.cNotifs, Screen.cProfile};
    if (custTabs.contains(s.screen) && s.app == AppMode.customer) return bottomNav(context);
    if (compTabs.contains(s.screen) && s.app == AppMode.company) return bottomNav(context);

    switch (s.screen) {
      case Screen.config:
        return estBar(context, s.t['continue'], () => s.go(Screen.schedule));
      case Screen.schedule:
        return estBar(context, s.t['review'], () => s.go(Screen.summary));
      case Screen.vendor:
        return stickyButtonBar(context, PrimaryButton('${s.t['bookNow']} · ${s.fmt(s.company.base)}${s.t['perHourShort']}', s.startBooking, fontSize: 16));
      case Screen.summary:
        return stickyButtonBar(context, PrimaryButton('${s.t['continuePay']} · ${s.fmt(s.price().total)}', s.agree ? () => s.go(Screen.payment) : null, enabled: s.agree));
      case Screen.payment:
        final isCash = s.payIdx == 6;
        final label = isCash ? (s.isAr ? 'تأكيد الطلب' : 'Confirm request') : '${s.t['pay']} ${s.fmt(s.price().total)}';
        return stickyButtonBar(context, PrimaryButton(label, s.payIdx != null ? s.pay : null, enabled: s.payIdx != null, fontSize: 16));
      default:
        return null;
    }
  }
}
