import 'package:flutter/material.dart';
import 'store.dart';
import 'widgets/ui.dart';
import 'root.dart';

void main() => runApp(const EgyCleansApp());

class EgyCleansApp extends StatefulWidget {
  const EgyCleansApp({super.key});
  @override
  State<EgyCleansApp> createState() => _EgyCleansAppState();
}

class _EgyCleansAppState extends State<EgyCleansApp> {
  final AppStore store = AppStore();

  @override
  void dispose() {
    store.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      store: store,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Egy Cleans',
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFF6F8FC),
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E63FF)),
          splashFactory: InkRipple.splashFactory,
        ),
        home: const RootView(),
      ),
    );
  }
}
