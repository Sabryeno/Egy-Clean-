import 'package:flutter/material.dart';

enum Screen {
  splash, login, signup, corpReg, review,
  home, search, vendor, config, schedule,
  summary, payment, success, bookings, account,
  custNotifs, custProfile,
  cHome, cServices, cHistory, cNotifs, cProfile,
  cServiceForm, cStaffForm,
}

enum AppMode { auth, customer, company }
enum Acct { individual, corporate }

class CompanyDef {
  final String mono;
  final List<Color> grad;
  final Map<String, String> name;
  final Map<String, String> tag;
  final String rating;
  final int reviews;
  final String dist;
  final int base;
  final List<String> tags;
  final String hero;
  final Map<String, String> coverage;
  const CompanyDef({
    required this.mono, required this.grad, required this.name, required this.tag,
    required this.rating, required this.reviews, required this.dist, required this.base,
    required this.tags, required this.hero, required this.coverage,
  });
}

class Booking {
  final String mono;
  final List<Color> grad;
  final String name;
  final String service;
  final String datetime;
  final String id;
  final String total;
  final String status; // upcoming | past
  final bool paid;
  final String method;
  const Booking({
    required this.mono, required this.grad, required this.name, required this.service,
    required this.datetime, required this.id, required this.total, required this.status,
    required this.paid, required this.method,
  });
}

class IncomingJob {
  final String customer;
  final String service;
  final String datetime;
  final String total;
  final String method; // 'cash' | 'paid'
  String state; // pending | new | approved | declined | ack
  final bool paid;
  final String? payMethod;
  final String staff;
  final int svcIdx;
  final String bucket; // today | week
  IncomingJob({
    required this.customer, required this.service, required this.datetime, required this.total,
    required this.method, required this.state, required this.paid, this.payMethod,
    required this.staff, required this.svcIdx, required this.bucket,
  });
}

class CustomerHistoryItem {
  final String customer;
  final String service;
  final String datetime;
  final String total;
  final String status;
  final bool paid;
  final String method;
  final String staff;
  final int svcIdx;
  const CustomerHistoryItem({
    required this.customer, required this.service, required this.datetime, required this.total,
    required this.status, required this.paid, required this.method, required this.staff, required this.svcIdx,
  });
}

class CServiceItem {
  final int id;
  final int typeIdx;
  final int rate;
  final int cleaners;
  final String capacity;
  const CServiceItem({required this.id, required this.typeIdx, required this.rate, required this.cleaners, required this.capacity});
  CServiceItem copyWith({int? typeIdx, int? rate, int? cleaners, String? capacity}) => CServiceItem(
        id: id, typeIdx: typeIdx ?? this.typeIdx, rate: rate ?? this.rate,
        cleaners: cleaners ?? this.cleaners, capacity: capacity ?? this.capacity,
      );
}

class StaffMember {
  final String name;
  final String? mono;
  final Color color;
  final double rating;
  final int jobs;
  final String role;
  const StaffMember({required this.name, this.mono, required this.color, required this.rating, required this.jobs, required this.role});
}

class SvcForm {
  int? editId;
  int typeIdx;
  int rate;
  int cleaners;
  String capacity;
  SvcForm({this.editId, this.typeIdx = 0, this.rate = 100, this.cleaners = 1, this.capacity = ''});
}

class StaffForm {
  String name;
  String role;
  Color color;
  StaffForm({this.name = '', this.role = '', this.color = const Color(0xFF1E63FF)});
}

/// Live in-app notification entry (customer or company feed).
class NotifItem {
  final String icon;
  final Color iconBg;
  final String title;
  final String body;
  final String time;
  bool unread;
  NotifItem({required this.icon, required this.iconBg, required this.title, required this.body, required this.time, this.unread = false});
}
