import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ClipboardList, List, MapPinned, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { usePropertyNoteAccess } from '@/hooks/queries/usePropertyNotes';

/**
 * Shared page shell — Create / Edit / Map / List / Approvals (same side gutters).
 */
export const PROPERTY_NOTE_PAGE_SHELL =
  'container mx-auto max-w-6xl px-4 pt-24 pb-6';

interface PropertyNotePageHeaderProps {
  title: string;
  description?: string;
  /**
   * Under the title (e.g. status badges on Detail).
   */
  meta?: ReactNode;
  /**
   * Note-level actions (Edit / Mark / Delete) — beside title, not under global nav.
   */
  actions?: ReactNode;
  /**
   * Back link target. Create/Detail default to list; Edit should pass detail.
   */
  backTo?: string;
  backLabel?: string;
  /**
   * Force show/hide Back. Default: hidden on Map / List / Approvals (segment nav is enough).
   */
  showBack?: boolean;
  /**
   * Extra under global nav (e.g. map counts). Not for note CRUD.
   */
  extra?: ReactNode;
}

/** Soft jade active — matches site nav; Create stays the only solid CTA on browse. */
function navItemClass(active: boolean): string {
  return cn(
    'h-9 rounded-lg border-0 px-3 shadow-none',
    active
      ? 'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary'
      : 'bg-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary'
  );
}

/**
 * Shared Property Note page header — same actions on every sub-page; content below varies.
 * Map / List / Create only when unlock access is allowed; Approvals stays for approvers.
 */
export function PropertyNotePageHeader({
  title,
  description,
  meta,
  actions,
  backTo,
  backLabel,
  showBack: showBackProp,
  extra,
}: PropertyNotePageHeaderProps) {
  const { language } = useLanguage();
  const mm = language === 'mm';
  const location = useLocation();
  const isApprover = Boolean(useAuthStore((s) => s.user)?.is_property_note_approver);
  const { data: accessResponse } = usePropertyNoteAccess();
  const isAllowed = Boolean(accessResponse?.data?.data?.is_allowed);

  const path = location.pathname;
  const onMap = path.startsWith('/my-property-notes/map');
  const onList = path === '/my-property-notes/list' || path.endsWith('/my-property-notes/list');
  const onCreate = path.startsWith('/my-property-notes/create');
  const onApprovals = path.startsWith('/my-property-notes/approvals');
  const onEdit = /\/my-property-notes\/\d+\/edit\/?$/.test(path);
  const onDetail = /\/my-property-notes\/\d+\/?$/.test(path) && !onEdit;

  /** Browse views: Approvals / Map / List — no Back (segment nav is enough). */
  const isBrowseView = onMap || onList || onApprovals;
  const showBack = showBackProp ?? !isBrowseView;

  /**
   * Create Note only on browse pages — hide on Detail / Edit / Create (wrong primary CTA).
   */
  const showCreateNote = isBrowseView && isAllowed;

  /**
   * Explicit destination labels — never vague "Back" on leaf pages.
   */
  const resolvedBackTo =
    backTo ??
    (onCreate || onDetail ? '/my-property-notes/list' : '/my-property-notes');
  const resolvedBackLabel =
    backLabel ??
    (onCreate || onDetail
      ? mm
        ? 'စာရင်းသို့'
        : 'Back to list'
      : onEdit
        ? mm
          ? 'အသေးစိတ်သို့'
          : 'Back to detail'
        : mm
          ? 'ပြန်သွားရန်'
          : 'Back');

  const showUnlockActions = isAllowed;
  const showSegmentNav = isApprover || showUnlockActions;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-1 -ml-2 text-muted-foreground hover:text-primary"
          >
            <Link to={resolvedBackTo}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              {resolvedBackLabel}
            </Link>
          </Button>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
            {meta ? <div className="mt-2">{meta}</div> : null}
          </div>
          {actions ? (
            <div
              className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end"
              aria-label={mm ? 'မှတ်စု လုပ်ဆောင်ချက်များ' : 'Note actions'}
            >
              {actions}
            </div>
          ) : null}
        </div>
      </div>

      {/**
       * Global nav only (segment ± Create). Note CRUD stays in `actions` beside the title.
       */}
      {(showSegmentNav || extra) && (
        <div
          className={cn(
            'flex flex-col items-stretch gap-2.5 sm:items-end',
            showBack ? 'sm:pt-9' : 'sm:pt-0.5'
          )}
        >
          {showSegmentNav ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <div
                className="inline-flex flex-wrap items-center gap-0.5 rounded-xl border border-primary/15 bg-card/80 p-1 shadow-sm"
                role="navigation"
                aria-label={mm ? 'မှတ်စု လမ်းကြောင်း' : 'Property note views'}
              >
                {isApprover && (
                  <Button variant="ghost" size="sm" asChild className={navItemClass(onApprovals)}>
                    <Link to="/my-property-notes/approvals">
                      <ClipboardList className="mr-1.5 h-4 w-4" />
                      {mm ? 'အတည်ပြုမှုများ' : 'Approvals'}
                    </Link>
                  </Button>
                )}
                {showUnlockActions ? (
                  <>
                    <Button variant="ghost" size="sm" asChild className={navItemClass(onMap)}>
                      <Link to="/my-property-notes/map">
                        <MapPinned className="mr-1.5 h-4 w-4" />
                        {mm ? 'မြေပုံ' : 'Map'}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className={navItemClass(onList)}>
                      <Link to="/my-property-notes/list">
                        <List className="mr-1.5 h-4 w-4" />
                        {mm ? 'စာရင်း' : 'List'}
                      </Link>
                    </Button>
                  </>
                ) : null}
              </div>
              {showCreateNote ? (
                <Button size="sm" asChild className="h-9 shadow-sm shadow-primary/20">
                  <Link to="/my-property-notes/create">
                    <Plus className="mr-1.5 h-4 w-4" />
                    {mm ? 'မှတ်စု အသစ်' : 'Create Note'}
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
          {extra ? <div className="flex flex-wrap gap-2 sm:justify-end">{extra}</div> : null}
        </div>
      )}
    </div>
  );
}
