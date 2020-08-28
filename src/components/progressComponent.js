import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
});
export default function ProgressComponent() {
  useEffect(() => {
    NProgress.start();
    return () => NProgress.done(true);
  }, []);
  return null;
}
