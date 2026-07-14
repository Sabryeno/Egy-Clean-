import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:egy_cleans/main.dart';

void main() {
  testWidgets('end-to-end: eased login, live price, booking, real-time sync', (tester) async {
    // tall surface so long screens don't overflow in the test viewport
    tester.view.physicalSize = const Size(600, 3400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await tester.pumpWidget(const EgyCleansApp());

    // splash auto-advances to login after 1.9s
    await tester.pump(const Duration(seconds: 2));
    await tester.pump();
    expect(find.text('Welcome back'), findsOneWidget, reason: 'splash -> login');
    expect(find.text('Quick access'), findsOneWidget, reason: 'eased login present');

    // eased one-tap entry
    await tester.tap(find.text('Enter as customer'));
    await tester.pumpAndSettle();
    expect(find.text('Wallet balance'), findsWidgets, reason: 'login -> home dashboard');

    // open a vendor
    await tester.tap(find.text('Bayti Clean'));
    await tester.pumpAndSettle();
    expect(find.text('Coverage area'), findsOneWidget, reason: 'home -> vendor');

    // start booking
    await tester.tap(find.textContaining('Book now'));
    await tester.pumpAndSettle();
    expect(find.text('Build your booking'), findsOneWidget, reason: 'vendor -> config');

    // live price: Standard 90 x2h x1 = 180 -> +5% +14% = EGP 214
    expect(find.text('EGP 214'), findsOneWidget, reason: 'initial live estimate');
    await tester.tap(find.text('Deep clean'));
    await tester.pump();
    // Deep 130 x2 = 260 -> EGP 309
    expect(find.text('EGP 309'), findsOneWidget, reason: 'live price recomputes on cleaning type');

    // continue -> schedule -> summary
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();
    expect(find.text('When & where'), findsOneWidget, reason: 'config -> schedule');
    await tester.tap(find.text('Review'));
    await tester.pumpAndSettle();
    expect(find.text('Price breakdown'), findsOneWidget, reason: 'schedule -> summary');
    expect(find.text('Platform fee (5%)'), findsOneWidget);
    expect(find.text('VAT (14%)'), findsOneWidget);

    // agree then continue to payment
    await tester.tap(find.text('I agree to the cancellation policy and terms of service.'));
    await tester.pump();
    await tester.tap(find.textContaining('Continue to payment'));
    await tester.pumpAndSettle();
    expect(find.text('Cash on arrival'), findsOneWidget, reason: 'summary -> payment');

    // choose cash -> confirm request
    await tester.tap(find.text('Cash on arrival'));
    await tester.pump();
    await tester.tap(find.text('Confirm request'));
    await tester.pumpAndSettle();
    expect(find.text('Booking requested'), findsOneWidget, reason: 'cash payment -> success (requested)');

    // view bookings -> new booking present
    await tester.tap(find.text('View my bookings'));
    await tester.pumpAndSettle();
    expect(find.text('Bayti Clean'), findsWidgets, reason: 'new booking appears in list');
    expect(find.textContaining('Unpaid'), findsWidgets, reason: 'cash booking shows Unpaid pill');

    // ---- real-time cross-screen sync: the same booking reaches the company dashboard ----
    await tester.tap(find.text('Profile')); // bottom nav -> account
    await tester.pumpAndSettle();
    await tester.tap(find.text('Log out'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Enter as company'));
    await tester.pumpAndSettle();
    expect(find.text('Incoming bookings'), findsOneWidget, reason: 'company dashboard');
    expect(find.text('Overview'), findsOneWidget, reason: 'analytics present');
    expect(find.text('Rana'), findsWidgets, reason: 'customer booking synced to company incoming feed');

    // approve the incoming cash job (real-time action)
    expect(find.text('Approve'), findsWidgets);
    await tester.tap(find.text('Approve').first);
    await tester.pump();
    expect(find.text('✓ Approve'), findsWidgets, reason: 'approve updates job state live');
  });

  testWidgets('language toggle mirrors to RTL Arabic', (tester) async {
    tester.view.physicalSize = const Size(600, 3400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
    await tester.pumpWidget(const EgyCleansApp());
    await tester.pump(const Duration(seconds: 2));
    await tester.pump();
    // toggle to Arabic
    await tester.tap(find.text('عربي'));
    await tester.pumpAndSettle();
    expect(find.text('مرحباً بعودتك'), findsOneWidget, reason: 'Arabic welcome copy');
    expect(Directionality.of(tester.element(find.text('مرحباً بعودتك'))), TextDirection.rtl, reason: 'layout mirrored to RTL');
  });
}
