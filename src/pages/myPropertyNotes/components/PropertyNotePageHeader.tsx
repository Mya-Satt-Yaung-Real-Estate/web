import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ClipboardList, List, MapPinned, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { usePropertyNoteAccess } from '@/hooks/queries/usePropertyNotes';

interface PropertyNotePageHeaderProps {
  title: string;
  description?: string;
  /**
   * Back link target (default: list).
   */
  backTo?: string;
  backLabel?: string;
  /**
   * Extra right-side content under the shared nav actions (e.g. map counts).
   */
  extra?: ReactNode;
}

/**
 * Shared Property Note page header — same actions on every sub-page; content below varies.
 * Map / List / Create only when unlock access is allowed; Approvals stays for approvers.
 */
export function PropertyNotePageHeader({
  title,
  description,
  backTo = '/my-property-notes/list',
  backLabel,
  extra,
}: PropertyNotePageHeaderProps) {
  const { language } = useLanguage();
  const mm = language === 'mm';
  const location = useLocation();
  const isApprover = Boolean(useAuthStore((s) => s.user)?.is_property_note_approver);
  const { data: accessResponse } = usePropertyNoteAccess();
  const isAllowed = Boolean(accessResponse?.data?.data?.is_allowed);

  const resolvedBackLabel =
    backLabel ?? (mm ? 'စာရင်းသို့' : 'Back to list');

  const path = location.pathname;
  const onMap = path.startsWith('/my-property-notes/map');
  const onList = path === '/my-property-notes/list' || path.endsWith('/my-property-notes/list');
  const onCreate = path.startsWith('/my-property-notes/create');
  const onApprovals = path.startsWith('/my-property-notes/approvals');

  const showUnlockActions = isAllowed;
  const showNavActions = isApprover || showUnlockActions;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2">
          <Link to={backTo}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {resolvedBackLabel}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description ? (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:items-end sm:pt-8">
        {showNavActions ? (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {isApprover && (
              <Button variant={onApprovals ? 'secondary' : 'outline'} asChild>
                <Link to="/my-property-notes/approvals">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {mm ? 'အတည်ပြုမှုများ' : 'Approvals'}
                </Link>
              </Button>
            )}
            {showUnlockActions ? (
              <>
                <Button variant={onMap ? 'secondary' : 'outline'} asChild>
                  <Link to="/my-property-notes/map">
                    <MapPinned className="h-4 w-4 mr-2" />
                    {mm ? 'မြေပုံ' : 'Map'}
                  </Link>
                </Button>
                <Button variant={onList ? 'secondary' : 'outline'} asChild>
                  <Link to="/my-property-notes/list">
                    <List className="h-4 w-4 mr-2" />
                    {mm ? 'အိမ်ခြံမြေမှတ်စုများ စာရင်း' : 'Property Note List'}
                  </Link>
                </Button>
                <Button variant={onCreate ? 'secondary' : 'default'} asChild>
                  <Link to="/my-property-notes/create">
                    <Plus className="h-4 w-4 mr-2" />
                    {mm ? 'အိမ်ခြံမြေမှတ်စု အသစ်' : 'Create Note'}
                  </Link>
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
        {extra ? <div className="flex flex-wrap gap-2 sm:justify-end">{extra}</div> : null}
      </div>
    </div>
  );
}
