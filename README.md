# 📦 Smart Barcode Product Manager - تطبيق إدارة المنتجات وقراءة الباركود

تطبيق ويب حديث ومتوافق بالكامل مع الهواتف المحمولة (Mobile-First) مخصص لإدارة المنتجات وقراءة الباركود فورياً باستخدام كاميرا الهاتف والبحث في قاعدة بيانات **Firebase** الحقيقية.

![Smart Barcode](/public/favicon.svg)

---

## 🌟 الميزات الرئيسية

1. **تصميم Mobile-First و RTL بالكامل**: واجهة مستخدم احترافيّة وسلسة باللغة العربية مع شريط تنقل سفلي ساطع للهواتف المحمولة.
2. **قارئ باركود بالكاميرا (Real-Time Camera Barcode Scanner)**:
   - فتح الكاميرا الخلفية تلقائياً على الموبايل.
   - دعم التنسيقات العالمية المشهورة: `EAN-13`, `EAN-8`, `UPC-A`, `UPC-E`, `Code 128`, `Code 39`, `QR Code`.
   - استخراج وتخزين رقم الباركود الصريح واستعلام Firestore بسرعة فائقة.
   - إتاحة زر **"قراءة منتج آخر"** لمسح المنتجات المتتالية دون الحاجة للعودة للرئيسية.
   - في حال عدم وجود الباركود: إظهار تنبيه وإتاحة زر **"إضافة هذا المنتج"** مع تعبئة الباركود تلقائياً.
3. **إدارة المنتجات الكاملة (CRUD)**:
   - إضافة، تعديل، حذف، واستعراض المنتجات.
   - رفع صور المنتجات إلى **Firebase Storage** مع ضغط الصور تلقائياً على المتصفح (Client-side Compression) لسرعة التحميل.
   - التحقق التلقائي لمنع تكرار رقم الباركود في المستندات.
   - بحث فوري بالاسم أو رقم الباركود.
4. **حماية وأمان مع Firebase Auth**:
   - حماية المسارات (Protected Routes).
   - قواعد أمان صارمة لـ Firestore و Storage لمنع الوصول غير المصرح به.
5. **تطبيقات الويب التقدمية (PWA)**:
   - إمكانية التثبيت على شاشة الهاتف الرئيسية (`Add to Home Screen`).

---

## 🛠️ التقنيات المستخدمة

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS3 (Custom Properties, Glassmorphism, Responsive Flexbox/Grid, Animations)
- **Backend & Database**: Firebase (Client SDK v10)
  - **Firebase Authentication**: إدارة جلسات المستخدمين (Email & Password).
  - **Cloud Firestore**: قاعدة البيانات النووية للمنتجات.
  - **Firebase Storage**: تخزين واستضافة صور المنتجات.
- **Barcode Camera Scanner**: `@html5-qrcode`
- **Image Compression**: `browser-image-compression`
- **Icons**: `lucide-react`

---

## 📁 هيكل المشروع (Project Structure)

```text
c:/Users/alnaseem/Documents/anti/باركود ماركت/
├── public/
│   ├── favicon.svg
│   └── manifest.json          # PWA Web App Manifest
├── src/
│   ├── components/
│   │   ├── common/            # المكونات العامة (Spinner, Modal, Skeleton, Header)
│   │   ├── layout/            # الهياكل والشريط السفلي والعلوي (TopNav, BottomNav, AppLayout)
│   │   ├── products/          # بطاقة المنتج ونموذج الإضافة/التعديل (ProductCard, ProductForm)
│   │   └── scanner/           # قارئ الكاميرا والنافذة المنبثقة (CameraScanner, CameraScannerModal)
│   ├── context/               # AuthContext جلسة تسجيل الدخول
│   ├── firebase/              # تهيئة Firebase وقواعد الأمان
│   ├── hooks/                 # useAuth, useProducts
│   ├── pages/                 # صفحات التطبيق (Login, Dashboard, Scanner, Products, Add, Edit)
│   ├── services/              # خدمات Firebase (authService, productService, storageService)
│   ├── types/                 # تعريفات TypeScript
│   ├── utils/                 # تنسيق الأسعار والتاريخ وضغط الصور (formatters, imageCompressor)
│   ├── App.tsx                # توجيه الصفحات React Router
│   ├── index.css              # التصميم والأنماط الرئيسية RTL
│   └── main.tsx
├── .env.example               # قالب متغيرات البيئة
├── firestore.rules            # قواعد أمان Firestore
├── storage.rules              # قواعد أمان Storage
├── firestore.indexes.json     # فهارس الاستعلام
├── firebase.json              # إعدادات Firebase Hosting
├── package.json
└── vite.config.ts
```

---

## 🚀 كيفية التشغيل والربط مع Firebase

### 1. تثبيت الحزم (Installation)

في مجلد المشروع، قم بتشغيل الأمر:

```bash
cmd /c npm install
```

---

### 2. إعداد مشروع Firebase (Firebase Setup)

1. اذهب إلى [موقع Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعاً جديداً باسم **Smart Barcode**.
2. **تفعيل المصادقة (Authentication)**:
   - من القائمة الجانبية اختر **Build** > **Authentication**.
   - اضغط **Get Started** ثم فعّل خيار **Email/Password**.
   - أنشئ حاسب مستخدم جديد (بريد إلكتروني وكلمة مرور) لتسجيل الدخول منه.
3. **تفعيل قاعدة البيانات (Cloud Firestore)**:
   - اختر **Build** > **Firestore Database**.
   - اضغط **Create database** واختر المنطقة المجاورة.
   - اختر البدء في وضع الإنتاج (Production mode).
4. **تفعيل التخزين (Firebase Storage)**:
   - اختر **Build** > **Storage**.
   - اضغط **Get Started** ثم اضغط Done.
5. **الحصول على مفاتيح التطبيق**:
   - اذهب إلى **Project Settings** (علامة الترس ⚙️) > **General**.
   - في أسفل الصفحة اضغط على أيقونة الويب `</>` لتسجيل تطبيق جديد.
   - انسخ الكائن `firebaseConfig`.

---

### 3. ضبط متغيرات البيئة (Environment Variables)

قم بإنشاء ملف `.env` في جذر المشروع (أو تعديل الملف الموجود) وضع فيه البيانات كالتالي:

```env
VITE_FIREBASE_API_KEY=AIzaSyA...
VITE_FIREBASE_AUTH_DOMAIN=smart-barcode.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-barcode
VITE_FIREBASE_STORAGE_BUCKET=smart-barcode.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

---

### 4. تطبيق قواعد الأمان (Security Rules)

ضع قواعد **Firestore Rules** من ملف `firestore.rules`:
```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

ضع قواعد **Storage Rules** من ملف `storage.rules`:
```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### 5. التشغيل المحلي (Running Locally)

لتشغيل السيرفر المحلي:

```bash
cmd /c npm run dev
```

افتح المتصفح على العنوان: `http://localhost:3000`

> 💡 **ملاحظة هامة لقراءة الباركود بالكاميرا**: تتطلب كاميرات الهواتف الاتصال عبر البروتوكول الآمن `https://` أو `localhost`. عند تجربة الموقع من الموبايل عبر الشبكة المحلية، استخدم HTTPS أو خوادم التقديم المقترحة.

---

### 6. البناء للنشر (Production Build & Deployment)

لبناء المشروع وإنشاء ملفات `dist`:

```bash
cmd /c npm run build
```

#### النشر على Firebase Hosting:

1. قم بتثبيت أدوات Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. سجل الدخول إلى Firebase:
   ```bash
   firebase login
   ```
3. قم بنشر الموقع:
   ```bash
   firebase deploy
   ```

---

## 🏆 سيناريو تجربة الاستخدام الاختباري (End-to-End Test Scenario)

1. يفتح المستخدم الموقع ويظهر له نموذج تسجيل الدخول.
2. يدخل البريد وكلمة مرور Firebase الخاصة به وتفتح **لوحة التحكم (Dashboard)**.
3. تظهر إحصائية إجمالي المنتجات والمنتج الأخير مع أزرار الإجراءات.
4. عند الضغط على **[ ＋ إضافة منتج ]**:
   - يختار صورة المنتج (يتم ضغطها وتوليد معاينة سريعة).
   - يكتب اسم المنتج والسعر بالدينار العراقي (مثال: `7500` -> يظهر التنسيق `7,500 د.ع`).
   - يضغط **[ 📷 قراءة بالكاميرا ]** لقراءة الباركود مباشرة بال هاتف أو كتابته يدوياً.
   - يضغط **حفظ المنتج**: تُرفع الصورة إلى Firebase Storage ويُحفظ المستند في Firestore مع فحص منع تكرار الباركود.
5. يتوجه المستخدم إلى **[ 📷 قراءة باركود ]**:
   - تفتح الكاميرا الخلفية تلقائياً داخل إطار فحص مخصص.
   - عند توجيه الكاميرا نحو المنتج، يتم قراءة الباركود فورياً والاستعلام عن Firestore.
   - تُعرض بطاقة تحتوي على الصورة المكبرة، الاسم، رقم الباركود، والسعر.
   - يضغط المستخدم على **[ قراءة منتج آخر ]** لإكمال العمليات فوراً!

---

## 📝 الترخيص والتطوير

تم تطوير هذا التطبيق كـ **Production-Ready Application** متوافق مع كافة معايير الأداء والأنماط المعمارية النظيفة Clean Architecture.
