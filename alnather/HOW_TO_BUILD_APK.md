# تحويل نظام "عيادة العلي" إلى تطبيق APK يعمل بدون نت

## شنو تغيّر بالمشروع؟
1. `lib/api.js` صار يخزّن كل البيانات محلياً على الجهاز (localStorage) بدل ما يسوي طلب لسيرفر Next.js.
   يعني **كل جهاز (موبايل/تابلت) صار عنده نسخته الخاصة من البيانات**، ومو مثل قبل وين كلهم
   يشتركون بجهاز واحد مضيف عبر الشبكة.
   - لنقل البيانات بين الأجهزة: روح "الإعدادات ← النسخ الاحتياطي ← تنزيل نسخة كاملة"
     على الجهاز الأول، وبعدين "استعادة من ملف" على الجهاز الثاني.
2. الخطوط (Tajawal) وأيقونات Font Awesome صارت مثبّتة كحزم npm محلية
   (`@fontsource/tajawal`, `@fortawesome/fontawesome-free`) بدل ما تنجلب من الإنترنت (CDN) —
   لأن التطبيق المستقل ما راح يكون عنده نت.
3. `next.config.js` صار فيه `output: 'export'` عشان Next.js يصدّر الموقع كملفات HTML/JS/CSS
   ثابتة (مجلد `out/`) بدون الحاجة لسيرفر Node يشتغل خلفية.
4. تمت إضافة Capacitor (`capacitor.config.ts` + مجلد `android/`) وهو اللي يغلّف ملفات
   الموقع الثابتة داخل تطبيق أندرويد حقيقي (APK).

## ليش ما قدرت أسوي لك ملف APK جاهز؟
بيئة التنفيذ عندي مقيدة بالشبكة ومسموحة بس لمواقع npm/pypi/github، وما عندها وصول لخوادم
Gradle وAndroid SDK (`services.gradle.org`, `dl.google.com`) اللي لازمة فعلياً لتصريف (compile)
كود الأندرويد لملف APK. جهزت كل شي غير هذي الخطوة الأخيرة، وهي بسيطة عندك بجهازك.

## خطوات إكمال بناء الـ APK (على جهازك)

### المتطلبات
- Node.js 18+ مثبت.
- **Android Studio** مثبت (فيه Android SDK + Gradle، ويحمّلهم تلقائياً أول مرة).

### الخطوات
```bash
# 1) فك ضغط المشروع وادخل المجلد
cd alnather

# 2) ثبّت الحزم
npm install

# 3) ابني نسخة الويب الثابتة (تحدّث مجلد out/)
npm run build

# 4) زامن الملفات مع مشروع أندرويد (موجود مسبقاً بمجلد android/)
npx cap sync android

# 5) افتح المشروع بـ Android Studio
npx cap open android
```
بعدها بـ Android Studio:
- خلي البرنامج يخلص "Gradle Sync" أول مرة (يحمّل الأدوات تلقائياً — يحتاج نت هذي المرة بس،
  مرة وحدة فقط لتجهيز بيئة البناء، مو لتشغيل التطبيق).
- من القائمة: **Build ← Build Bundle(s) / APK(s) ← Build APK(s)**.
- الملف الناتج يطلع بمسار مثل:
  `android/app/build/outputs/apk/debug/app-debug.apk`
- انسخه لموبايلك وثبّته (فعّل "تثبيت من مصادر غير معروفة" إذا طلب منك).

### إذا ظهر خطأ `JAVA_HOME` أو `AAPT2` على Windows

المشروع يستخدم Android Gradle Plugin 8.2.1؛ استخدم **JDK 17 كاملًا**، وتأكد أن `JAVA_HOME` يشير إلى مجلد الـ JDK نفسه (وليس مجلد `bin`). بدّل المسار أدناه بمسار JDK 17 الموجود عندك:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
Test-Path "$env:JAVA_HOME\bin\jlink.exe" # لازم ترجع True
cd .\android
.\gradlew.bat --stop
.\gradlew.bat assembleDebug
```

من Android Studio ← **SDK Manager** تأكد من تثبيت Android SDK Platform 34 و Android SDK Build-Tools 34.0.0. لا تشغّل `aapt2.exe` يدويًا؛ Gradle يستدعيه أثناء البناء. إذا منعه Windows Defender أو Device Guard، لا تعطّل حماية الجهاز؛ أصلح/حدّث Build-Tools من SDK Manager أو اطلب من مسؤول الجهاز معالجة سياسة الحظر.

### لو تريد بناءه من التيرمينال مباشرة (بدون فتح الواجهة)
```bash
cd android
./gradlew assembleDebug
```
الملف يطلع بنفس المسار أعلاه.

### نسخة موقّعة للنشر (Release APK)
البناء اللي فوق ينتج نسخة Debug (تشتغل تمام بس فيها توقيع تجريبي). لو تريدها تنزلها بمتجر
أو توزعها رسمياً، تحتاج تسوي "Generate Signed Bundle / APK" من نفس قائمة Build بأندرويد
ستوديو وتسوي مفتاح توقيع (Keystore) خاص فيك.

## ملاحظات مهمة
- بيانات الدخول التجريبية تبقى: **admin / admin123**.
- زر شعار العيادة: لو تحب تحط شعار افتراضي، حط صورة باسم `clinic-logo.png` داخل مجلد
  `public/` قبل خطوة `npm run build`.
- إذا عدّلت أي كود لاحقاً، دايماً كرر الخطوات 3 و4 (`npm run build` ثم `npx cap sync android`)
  قبل ما تبني APK جديد، عشان التعديلات تنعكس.
