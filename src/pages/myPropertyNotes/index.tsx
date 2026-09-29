import { Link } from 'react-router-dom';
import {
  MapPinned,
  List,
  Lock,
  Unlock,
  Coins,
  CalendarDays,
  AlertCircle,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/authStore';
import { usePropertyNoteAccess } from '@/hooks/queries/usePropertyNotes';
import { useUnlockPropertyNote } from '@/hooks/mutations/usePropertyNoteMutations';
import { useSyncAuthProfileFlags } from '@/hooks/useSyncAuthProfileFlags';
import type { PropertyNoteAccess } from '@/types/propertyNote';

/**
 * Property Note hub — unlock gate first; map/list come in later steps.
 */
export default function MyPropertyNotesHub() {
  const seo = seoUtils.getPageSEO('myPropertyNotes');
  const { language } = useLanguage();
  const { showSuccess, showError } = useModal();
  const user = useAuthStore((s) => s.user);
  const isApprover = Boolean(user?.is_property_note_approver);
  useSyncAuthProfileFlags(true);
  const { data: response, isLoading, error, refetch } = usePropertyNoteAccess();
  const unlockMutation = useUnlockPropertyNote();

  const access = response?.data?.data as PropertyNoteAccess | undefined;
  const isAllowed = Boolean(access?.is_allowed);

  const mm = language === 'mm';

  const handleUnlock = () => {
    unlockMutation.mutate(undefined, {
      onSuccess: (res) => {
        const result = res.data?.data;
        if (result?.already_unlocked) {
          showSuccess(
            mm ? 'Property Note ကို ဖွင့်ပြီးသားဖြစ်သည်။' : 'Property Note is already unlocked.',
            mm ? 'အောင်မြင်ပါသည်' : 'Success'
          );
          return;
        }
        if (result?.already_pending || result?.status === 'pending' || result?.status === 'admin_approved') {
          showSuccess(
            mm
              ? 'တောင်းဆိုမှု ပို့ပြီးပါပြီ။ အတည်ပြုချက် စောင့်ပေးပါ။'
              : 'Request submitted. Please wait for approval.',
            mm ? 'ပို့ပြီးပါပြီ' : 'Submitted'
          );
          return;
        }
        if (result?.is_allowed) {
          showSuccess(
            mm
              ? `ပွိုင့် ${result.points_consumed} ဖြတ်ပြီး ဖွင့်ပြီးပါပြီ။`
              : `Unlocked. ${result.points_consumed} points used.`,
            mm ? 'အောင်မြင်ပါသည်' : 'Success'
          );
          return;
        }
        showSuccess(res.data?.message || (mm ? 'ပြီးပါပြီ' : 'Done'), mm ? 'အောင်မြင်ပါသည်' : 'Success');
      },
      onError: (err: unknown) => {
        const errBody = err as {
          response?: {
            data?: {
              message?: string;
              errors?: {
                blocked_by_device_grant?: boolean;
                blocked_by_revoke?: boolean;
              };
            };
          };
          message?: string;
        };
        const blockedByDevice = Boolean(errBody.response?.data?.errors?.blocked_by_device_grant);
        const blockedByRevoke = Boolean(errBody.response?.data?.errors?.blocked_by_revoke);
        const message = blockedByDevice
          ? mm
            ? 'သတ်မှတ် device အတွက်သာ ခွင့်ပြုထားပါသည်။ Admin ထံ ဆက်သွယ်ပါ။'
            : 'Access is for a specific device only. Please contact admin.'
          : blockedByRevoke
            ? mm
              ? 'Access ရုပ်သိမ်းထားပါသည်။ Admin ထံ ဆက်သွယ်ပါ။'
              : 'Access was revoked. Please contact admin.'
            : errBody.response?.data?.message ||
              errBody.message ||
              (mm ? 'ဖွင့်၍မရပါ' : 'Unable to unlock');
        showError(message, mm ? 'အမှား' : 'Error');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-6 max-w-3xl">
      <SEOHead seo={seo} path="/my-property-notes" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {mm ? 'ပိုင်ဆိုင်မှု မှတ်စု (Property Notes)' : 'Property Notes'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {mm
            ? 'မြေပုံပေါ်တွင် ကိုယ်ပိုင် မှတ်စုများ ထားရှိရန်။ အရင် access ဖွင့်ရပါမည်။'
            : 'Keep your own map notes. Unlock access first to use the map and history.'}
        </p>
      </div>

      {isApprover && (
        <Card className="mb-6 border-amber-200 bg-amber-50/40">
          <CardContent className="!p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-medium text-gray-900">
                <ClipboardList className="h-5 w-5 text-amber-700" />
                {mm ? 'Approver — Property Note အတည်ပြုမှုများ' : 'Approver — Property Note Approvals'}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {mm
                  ? 'Admin အတည်ပြုပြီးသား တောင်းဆိုမှုများကို နောက်ဆုံး အတည်ပြု / ငြင်းပယ်ပါ။'
                  : 'Final approve or reject requests that admin already passed.'}
              </p>
            </div>
            <Button asChild className="w-fit shrink-0">
              <Link to="/my-property-notes/approvals">
                {mm ? 'အတည်ပြုမှုများ' : 'Open approvals'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="!p-6 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      )}

      {!isLoading && error && (
        <Card>
          <CardContent className="!p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{mm ? 'Access အချက်အလက် မရရှိပါ' : 'Could not load access status'}</span>
            </div>
            <Button variant="outline" onClick={() => refetch()} className="w-fit">
              {mm ? 'ပြန်ကြိုးစားရန်' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && access && !isAllowed && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-medium">
                {access.blocked_by_device_grant
                  ? mm
                    ? 'Website တွင် အသုံးပြု၍ မရပါ'
                    : 'Not available on website'
                  : access.blocked_by_revoke
                    ? mm
                      ? 'Access ရုပ်သိမ်းထားပါသည်'
                      : 'Access revoked'
                    : mm
                      ? 'Access ဖွင့်ရန်'
                      : 'Unlock access'}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="!p-6 !pt-2 space-y-4">
            {access.blocked_by_device_grant ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {mm
                  ? 'သတ်မှတ် device အတွက်သာ ခွင့်ပြုထားပါသည်။ Website မသုံးနိုင်ပါ။ Admin ထံ ဆက်သွယ်ပါ။'
                  : 'Access is for a specific device only. Please contact admin.'}
              </div>
            ) : null}

            {access.blocked_by_revoke ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {mm
                  ? 'Access ရုပ်သိမ်းထားပါသည်။ Admin ထံ ဆက်သွယ်ပါ။'
                  : 'Access was revoked. Please contact admin.'}
              </div>
            ) : null}

            {access.status === 'rejected' && access.reject_reason ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {mm ? 'ငြင်းပယ်ခံရသည် — ' : 'Rejected — '}
                {access.reject_reason}
              </div>
            ) : null}

            {!access.blocked_by_device_grant && !access.blocked_by_revoke ? (
              <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-md border p-3 flex items-start gap-2">
                <Coins className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-gray-500">{mm ? 'လိုအပ်သော ပွိုင့်' : 'Required points'}</div>
                  <div className="font-semibold text-gray-900">{access.required_points}</div>
                </div>
              </div>
              <div className="rounded-md border p-3 flex items-start gap-2">
                <Coins className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-gray-500">{mm ? 'လက်ကျန် ပွိုင့်' : 'Your balance'}</div>
                  <div className="font-semibold text-gray-900">{access.current_balance}</div>
                </div>
              </div>
              <div className="rounded-md border p-3 flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-gray-500">{mm ? 'အသုံးပြုနိုင်ရက်' : 'Access days'}</div>
                  <div className="font-semibold text-gray-900">{access.access_days}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleUnlock}
                disabled={unlockMutation.isPending}
              >
                <Unlock className="h-4 w-4 mr-2" />
                {unlockMutation.isPending
                  ? mm
                    ? 'လုပ်ဆောင်နေသည်…'
                    : 'Unlocking…'
                  : mm
                    ? 'Access ဖွင့်ရန်'
                    : 'Unlock now'}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/point-management">{mm ? 'ပွိုင့် ဝယ်ရန်' : 'Buy points'}</Link>
              </Button>
            </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && access && isAllowed && (
        <div className="space-y-4">
          <Card>
            <CardContent className="!p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <Unlock className="h-4 w-4" />
                  {mm ? 'Access ဖွင့်ပြီးပါပြီ' : 'Access unlocked'}
                </div>
                <p className="text-sm mt-1">
                  {access.remaining_days != null ? (
                    <span className="font-semibold text-amber-700">
                      {mm
                        ? `ကျန်ရှိရက် — ${access.remaining_days} ရက်`
                        : `${access.remaining_days} days remaining`}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      {mm ? 'သက်တမ်း ကန့်သတ်မရှိ' : 'No expiry shown'}
                    </span>
                  )}
                  {access.expires_at ? (
                    <span className="text-amber-600/80"> · {access.expires_at}</span>
                  ) : null}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardContent className="!p-6 flex flex-col justify-center space-y-3 min-h-[160px]">
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <MapPinned className="h-5 w-5" />
                  {mm ? 'မြေပုံ' : 'Map'}
                </div>
                <p className="text-sm text-gray-600">
                  {mm
                    ? 'မှတ်စုနှင့် အိမ်ခြံမြေ pins ကို မြေပုံပေါ်တွင် ကြည့်ရန်။'
                    : 'View note and property pins on the map.'}
                </p>
                <Button asChild className="w-fit">
                  <Link to="/my-property-notes/map">{mm ? 'မြေပုံ ဖွင့်ရန်' : 'Open map'}</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="!p-6 flex flex-col justify-center space-y-3 min-h-[160px]">
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <List className="h-5 w-5" />
                  {mm ? 'မှတ်စု စာရင်း' : 'Property Note List'}
                </div>
                <p className="text-sm text-gray-600">
                  {mm
                    ? 'မှတ်စုများ ကြည့်ရန်၊ ဖန်တီးရန်၊ ပြင်ရန်။'
                    : 'View, create, and edit your notes.'}
                </p>
                <Button asChild className="w-fit">
                  <Link to="/my-property-notes/list">{mm ? 'စာရင်း ဖွင့်ရန်' : 'Open list'}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
