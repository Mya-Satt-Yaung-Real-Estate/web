import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SEOHead } from '@/components/seo/SEOHead';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/authStore';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useSyncAuthProfileFlags } from '@/hooks/useSyncAuthProfileFlags';
import { usePropertyNoteApprovals } from '@/hooks/queries/usePropertyNotes';
import {
  useApprovePropertyNoteRequest,
  useRejectPropertyNoteRequest,
} from '@/hooks/mutations/usePropertyNoteMutations';
import type {
  PropertyNoteApprovalFilterStatus,
  PropertyNoteApprovalItem,
} from '@/types/propertyNote';

function approvalStatusClass(status: string | null): string {
  if (status === 'admin_approved') return 'bg-amber-600 text-white hover:bg-amber-600 border-transparent';
  if (status === 'approved') return 'bg-green-600 text-white hover:bg-green-600 border-transparent';
  if (status === 'rejected') return 'bg-red-600 text-white hover:bg-red-600 border-transparent';
  if (status === 'revoked') return 'bg-slate-700 text-white hover:bg-slate-700 border-transparent';
  return 'bg-gray-500 text-white hover:bg-gray-500 border-transparent';
}

function getErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
      ?.message ||
    (err as { message?: string })?.message ||
    fallback
  );
}

/**
 * Approver Requests — list unlock requests; approve / reject final step.
 * Gate: is_property_note_approver (not unlock access).
 */
export default function PropertyNoteApprovalsPage() {
  const seo = seoUtils.getPageSEO('myPropertyNotesApprovals');
  const { language } = useLanguage();
  const mm = language === 'mm';
  const { showSuccess, showError } = useModal();
  const user = useAuthStore((s) => s.user);
  const isApprover = Boolean(user?.is_property_note_approver);
  const { isSynced } = useSyncAuthProfileFlags(true);

  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PropertyNoteApprovalFilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [rejectTarget, setRejectTarget] = useState<PropertyNoteApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: response, isLoading, error, refetch } = usePropertyNoteApprovals(
    {
      status,
      search: search.trim() || undefined,
      page: currentPage,
      per_page: 20,
    },
    isSynced && isApprover
  );

  const items = response?.data?.data || [];
  const pagination = response?.data?.pagination;
  const statistics = response?.data?.statistics;
  const pendingCount = response?.data?.pending_count ?? statistics?.admin_approved ?? 0;

  const approveMutation = useApprovePropertyNoteRequest();
  const rejectMutation = useRejectPropertyNoteRequest();

  const hasActiveFilters = Boolean(search.trim() || status !== 'all');

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setCurrentPage(1);
  };

  const handleApprove = (item: PropertyNoteApprovalItem) => {
    showConfirm({
      title: mm ? 'အတည်ပြုမည်' : 'Confirm approve',
      message: mm
        ? `${item.user?.name || 'User'} ၏ unlock ကို အတည်ပြုပြီး ပွိုင့် ဖြတ်မည်။`
        : `Approve unlock for ${item.user?.name || 'user'} and charge points?`,
      confirmText: mm ? 'အတည်ပြု' : 'Approve',
      cancelText: mm ? 'ပယ်ဖျက်' : 'Cancel',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          approveMutation.mutate(item.id, {
            onSuccess: () => {
              showSuccess(
                mm ? 'အတည်ပြုပြီးပါပြီ။' : 'Request approved.',
                mm ? 'အောင်မြင်ပါသည်' : 'Success'
              );
              resolve();
            },
            onError: (err: unknown) => {
              showError(
                getErrorMessage(err, mm ? 'အတည်ပြု၍မရပါ' : 'Approve failed'),
                mm ? 'အမှား' : 'Error'
              );
              reject(err);
            },
          });
        }),
    });
  };

  const openRejectDialog = (item: PropertyNoteApprovalItem) => {
    setRejectTarget(item);
    setRejectReason('');
  };

  const closeRejectDialog = () => {
    if (rejectMutation.isPending) return;
    setRejectTarget(null);
    setRejectReason('');
  };

  const submitReject = () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    rejectMutation.mutate(
      { id: rejectTarget.id, rejectReason: reason || undefined },
      {
        onSuccess: () => {
          showSuccess(
            mm ? 'ငြင်းပယ်ပြီးပါပြီ။' : 'Request rejected.',
            mm ? 'အောင်မြင်ပါသည်' : 'Success'
          );
          setRejectTarget(null);
          setRejectReason('');
        },
        onError: (err: unknown) => {
          showError(
            getErrorMessage(err, mm ? 'ငြင်းပယ်၍မရပါ' : 'Reject failed'),
            mm ? 'အမှား' : 'Error'
          );
        },
      }
    );
  };

  if (!isSynced) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-6 max-w-5xl">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!isApprover) {
    return <Navigate to="/my-property-notes" replace />;
  }

  return (
    <>
      <SEOHead seo={seo} path="/my-property-notes/approvals" />

      <div className="container mx-auto px-4 pt-24 pb-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2">
              <Link to="/my-property-notes">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {mm ? 'ပြန်သွားရန်' : 'Back'}
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {mm ? 'Unlock တောင်းဆိုမှုများ' : 'Unlock Requests'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {mm
                ? 'Admin အတည်ပြုပြီးသား တောင်းဆိုမှုများကို နောက်ဆုံး အတည်ပြု / ငြင်းပယ်ပါ။'
                : 'Final approve or reject requests that admin already passed.'}
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-amber-600 text-white hover:bg-amber-600 border-transparent w-fit">
              {mm ? `စောင့်ဆိုင်း ${pendingCount}` : `${pendingCount} waiting`}
            </Badge>
          )}
        </div>

        {statistics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <Card>
              <CardContent className="!p-4">
                <div className="text-xs text-gray-500">{mm ? 'စောင့်ဆိုင်း' : 'Ready'}</div>
                <div className="text-xl font-semibold text-amber-700">{statistics.admin_approved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="!p-4">
                <div className="text-xs text-gray-500">{mm ? 'အတည်ပြုပြီး' : 'Approved'}</div>
                <div className="text-xl font-semibold text-green-700">{statistics.approved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="!p-4">
                <div className="text-xs text-gray-500">{mm ? 'ငြင်းပယ်' : 'Rejected'}</div>
                <div className="text-xl font-semibold text-red-700">{statistics.rejected}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="!p-4">
                <div className="text-xs text-gray-500">{mm ? 'ပယ်ဖျက်' : 'Revoked'}</div>
                <div className="text-xl font-semibold text-slate-700">{statistics.revoked ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="!p-4">
                <div className="text-xs text-gray-500">{mm ? 'စုစုပေါင်း' : 'Total'}</div>
                <div className="text-xl font-semibold text-gray-900">{statistics.total}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="!p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder={mm ? 'အမည် / ဖုန်း / အီးမေးလ်' : 'Name / phone / email'}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v as PropertyNoteApprovalFilterStatus);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{mm ? 'အားလုံး' : 'All'}</SelectItem>
                  <SelectItem value="admin_approved">
                    {mm ? 'အတည်ပြုရန်' : 'Ready to approve'}
                  </SelectItem>
                  <SelectItem value="approved">{mm ? 'အတည်ပြုပြီး' : 'Approved'}</SelectItem>
                  <SelectItem value="rejected">{mm ? 'ငြင်းပယ်' : 'Rejected'}</SelectItem>
                  <SelectItem value="revoked">{mm ? 'ပယ်ဖျက်' : 'Revoked'}</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="outline" size="icon" onClick={resetFilters} title="Reset">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <Card>
            <CardContent className="!p-6 flex flex-col gap-3">
              <p className="text-red-600 text-sm">
                {mm ? 'စာရင်း မရရှိပါ' : 'Could not load requests'}
              </p>
              <Button variant="outline" onClick={() => refetch()} className="w-fit">
                {mm ? 'ပြန်ကြိုးစားရန်' : 'Retry'}
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && items.length === 0 && (
          <Card>
            <CardContent className="!p-8 text-center text-sm text-gray-600">
              {mm ? 'တောင်းဆိုမှု မရှိပါ။' : 'No requests found.'}
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-3 mb-6">
            {items.map((item) => {
              const canAct = item.status === 'admin_approved';
              return (
                <Card key={item.id}>
                  <CardContent className="!p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.user?.name || (mm ? 'အမည်မရှိ' : 'Unknown user')}
                        </span>
                        <Badge className={approvalStatusClass(item.status)}>{item.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        {item.user?.phone && <div>{item.user.phone}</div>}
                        {item.user?.email && <div className="truncate">{item.user.email}</div>}
                        <div>
                          {mm ? 'ပွိုင့်' : 'Points'}: {item.points_amount}
                          {' · '}
                          {mm ? 'လက်ကျန်' : 'Balance'}: {item.user?.current_point_balance ?? '—'}
                        </div>
                        <div>
                          {mm ? 'တောင်းဆို' : 'Requested'}: {item.requested_at || '—'}
                          {item.admin_approved_at
                            ? ` · Admin: ${item.admin_approved_at}${item.admin?.name ? ` (${item.admin.name})` : ''}`
                            : ''}
                        </div>
                        {item.reject_reason && (
                          <div className="text-red-700">
                            {mm ? 'အကြောင်းပြချက်' : 'Reason'}: {item.reject_reason}
                          </div>
                        )}
                      </div>
                    </div>

                    {canAct && (
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(item)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {mm ? 'အတည်ပြု' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => openRejectDialog(item)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {mm ? 'ငြင်းပယ်' : 'Reject'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {pagination && pagination.last_page > 1 && (
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => !open && closeRejectDialog()}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{mm ? 'ငြင်းပယ်ရန်' : 'Reject request'}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {mm
              ? `${rejectTarget?.user?.name || 'User'} ကို ငြင်းပယ်မည်။ အကြောင်းပြချက် (optional) ထည့်နိုင်သည်။`
              : `Reject ${rejectTarget?.user?.name || 'user'}. Reason is optional.`}
          </p>
          <Textarea
            rows={3}
            maxLength={500}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={mm ? 'အကြောင်းပြချက်…' : 'Reject reason…'}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeRejectDialog} disabled={rejectMutation.isPending}>
              {mm ? 'ပယ်ဖျက်' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={submitReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending
                ? mm
                  ? 'လုပ်ဆောင်နေသည်…'
                  : 'Rejecting…'
                : mm
                  ? 'ငြင်းပယ်မည်'
                  : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmOptions?.title || ''}
        message={confirmOptions?.message || ''}
        confirmText={confirmOptions?.confirmText}
        cancelText={confirmOptions?.cancelText}
        confirmVariant={confirmOptions?.confirmVariant}
        isLoading={isConfirmLoading}
      />
    </>
  );
}
