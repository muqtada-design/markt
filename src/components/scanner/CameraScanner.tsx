import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  paused?: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanSuccess,
  onScanError,
  paused = false,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const startScanner = async () => {
    setCameraError(null);
    setIsScanning(false);

    try {
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode('reader', {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        });
      }

      const qrCode = html5QrcodeRef.current;

      const config = {
        fps: 10,
        qrbox: { width: 260, height: 160 },
        aspectRatio: 1.333,
      };

      const handleScan = (decodedText: string) => {
        if (isMountedRef.current && !paused) {
          onScanSuccess(decodedText.trim());
        }
      };

      const handleError = (err: string) => {
        if (onScanError) onScanError(err);
      };

      // 1. الاستعلام عن الكاميرات المتاحة
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          // البحث عن الكاميرا الخلفية إن وجدت، وإلا استخدام أول كاميرا متاحة
          const backCamera = cameras.find((c) =>
            /back|rear|environment|خلفية/i.test(c.label)
          );
          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          await qrCode.start(cameraId, config, handleScan, handleError);
          if (isMountedRef.current) setIsScanning(true);
          return;
        }
      } catch (camErr) {
        console.warn('لم يتمكن من جلب قائمة الكاميرات بـ getCameras، تجربة القيود المباشرة:', camErr);
      }

      // 2. المحاولة الثانية: استخدام facingMode environment للهواتف
      try {
        await qrCode.start({ facingMode: 'environment' }, config, handleScan, handleError);
        if (isMountedRef.current) setIsScanning(true);
        return;
      } catch (envErr) {
        console.warn('فشلت الكاميرا الخلفية، تجربة الكاميرا الأمامية أو الافتراضية:', envErr);
      }

      // 3. المحاولة الثالثة: استخدام أي كاميرا متاحة (مثالية لأجهزة المكتبي واللابتوب)
      await qrCode.start({ facingMode: 'user' }, config, handleScan, handleError);
      if (isMountedRef.current) setIsScanning(true);
    } catch (err: any) {
      console.error('خطأ الكاميرا النهائي:', err);
      let msg = 'لم يتم السماح باستخدام الكاميرا أو لا توجد كاميرا متصلة. يرجى السماح للموقع من إعدادات المتصفح.';
      
      const errStr = err?.toString() || '';
      if (err?.name === 'NotFoundError' || errStr.includes('NotFoundError')) {
        msg = 'لم يتم العثور على أي كاميرا متصلة بهذا الجهاز.';
      } else if (err?.name === 'NotAllowedError' || errStr.includes('NotAllowedError') || errStr.includes('Permission denied')) {
        msg = 'تم رفض إذن استخدام الكاميرا. يرجى الضغط على أيقونة القفل أو الكاميرا في شريط عنوان المتصفح واختيار (سماح / Allow).';
      } else if (err?.name === 'OverconstrainedError' || errStr.includes('OverconstrainedError')) {
        msg = 'الكاميرا المطلوبة غير مدعومة بهذا الخيار. حاول إعادة التشغيل.';
      }

      if (isMountedRef.current) {
        setCameraError(msg);
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (e) {
        console.warn('توقف الماسح:', e);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    startScanner();

    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (paused && html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      html5QrcodeRef.current.pause();
    } else if (!paused && html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        html5QrcodeRef.current.resume();
      } catch (e) {
        console.warn('استئناف الماسح:', e);
      }
    }
  }, [paused]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {cameraError ? (
        <div className="alert alert-danger" style={{ maxWidth: '480px', width: '100%' }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>خطأ في الكاميرا</strong>
            <p style={{ marginTop: '4px', fontSize: '0.88rem', lineHeight: '1.4' }}>{cameraError}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={startScanner}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              >
                <RefreshCw size={14} />
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="scanner-viewport-wrapper">
          <div id="reader"></div>

          {isScanning && (
            <div className="scanner-overlay">
              <div className="scanner-frame">
                <div className="scan-laser-line"></div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Camera size={16} />
                وجّه الكاميرا نحو الباركود
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
