/**
 * Transaction List Component
 * 
 * Displays point transactions with pagination in table format.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePointTransactionsInfinite } from '@/hooks/queries/usePoints';
import { History, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { PointTransaction } from '@/types/points';

export function TransactionList() {
  const { t } = useLanguage();
  const perPage = 10;

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePointTransactionsInfinite(perPage);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-red-200">
        <CardHeader>
          <CardTitle className="text-base font-normal flex items-center gap-2 text-red-600">
            <History className="h-4 w-4" />
            {t('points.transactions.error') || 'Error Loading Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('points.transactions.errorMessage') || 'Failed to load transactions. Please try again later.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Flatten all pages of transactions
  const transactions = data?.pages.flatMap(page => {
    const apiResponse = page.data;
    return apiResponse?.data || [];
  }) || [];

  if (transactions.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            {t('points.transactions.title') || 'Transaction History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('points.transactions.noTransactions') || 'No transactions found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-normal flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          {t('points.transactions.title') || 'Transaction History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InfiniteScrollList
          hasNextPage={hasNextPage || false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          loadingComponent={
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          }
        >
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">
                    {t('points.transactions.no') || 'No'}
                  </TableHead>
                  <TableHead className="w-[50px]">
                    {t('points.transactions.type') || 'Type'}
                  </TableHead>
                  <TableHead>
                    {t('points.transactions.description') || 'Description'}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t('points.transactions.reference') || 'Reference'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('points.transactions.amount') || 'Amount'}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    {t('points.transactions.balanceBefore') || 'Balance Before'}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    {t('points.transactions.balanceAfter') || 'Balance After'}
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t('points.transactions.date') || 'Date'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: PointTransaction, index: number) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-center">
                      <span className="text-sm text-muted-foreground">
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.transaction_type === 'CREDIT' ? (
                          <ArrowUpCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            transaction.transaction_type === 'CREDIT'
                              ? 'border-green-600 text-green-600'
                              : 'border-red-600 text-red-600'
                          }`}
                        >
                          {transaction.transaction_type === 'CREDIT'
                            ? t('points.transactions.credit') || 'Credit'
                            : t('points.transactions.debit') || 'Debit'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[400px]">
                        <p className="whitespace-pre-wrap break-words">
                          {transaction.description || t('points.transactions.noDescription') || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {transaction.reference_type || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.transaction_type === 'CREDIT'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.formatted_points_amount || formatNumber(transaction.points_amount)}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      <span className="text-sm">
                        {formatNumber(transaction.balance_before)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      <span className="text-sm font-medium">
                        {formatNumber(transaction.balance_after)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {transaction.formatted_created_at}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </InfiniteScrollList>
      </CardContent>
    </Card>
  );
}

