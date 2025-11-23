/**
 * Loan Calculator Page
 * 
 * Calculate monthly loan payments, total costs, and affordability based on loan details.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Banknote, 
  DollarSign, 
  Calendar, 
  Percent
} from 'lucide-react';

interface EMIScheduleItem {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

interface CalculationResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  emiSchedule: EMIScheduleItem[];
}

const LOAN_TENURE_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1); // [1, 2, 3, ..., 30]

// Format currency helper (moved outside component)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate EMI helper function (Simple Interest)
const calculateEMI = (principal: number, annualRate: number, years: number, numberOfPayments: number): number => {
  if (principal <= 0 || annualRate <= 0 || numberOfPayments <= 0) {
    return 0;
  }
  
  // Simple Interest: Total Interest = Principal × Annual Rate × Years
  const totalInterest = principal * (annualRate / 100) * years;
  // Total Payment = Principal + Total Interest
  const totalPayment = principal + totalInterest;
  // Monthly Payment = Total Payment ÷ Total Months
  return totalPayment / numberOfPayments;
};

// Generate EMI schedule helper function (Simple Interest - Equal payments)
const generateEMISchedule = (
  principal: number,
  totalInterest: number,
  numberOfPayments: number,
  emi: number
): EMIScheduleItem[] => {
  const schedule: EMIScheduleItem[] = [];
  // Balance starts at total payment (principal + total interest)
  const totalPayment = principal + totalInterest;
  let balance = totalPayment;
  
  // Equal monthly principal and interest
  const monthlyPrincipal = principal / numberOfPayments;
  const monthlyInterest = totalInterest / numberOfPayments;

  for (let month = 1; month <= numberOfPayments; month++) {
    // Balance decreases by monthly payment (total payment reducing)
    balance -= emi;

    schedule.push({
      month,
      emi: emi,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
};

export function LoanCalculator() {
  const { t } = useLanguage();
  const seo = seoUtils.getPageSEO('loanCalculator');

  // Input states
  const [loanAmount, setLoanAmount] = useState(400000000);
  const [downPayment, setDownPayment] = useState(100000000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [interestRateDisplay, setInterestRateDisplay] = useState(7.5); // For smooth slider updates
  const [loanTenure, setLoanTenure] = useState(15);

  // Use ref to store timeout for debouncing interest rate slider
  const interestRateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized calculation results
  const calculationResults = useMemo<CalculationResults>(() => {
    const principal = loanAmount - downPayment;
    const numberOfPayments = loanTenure * 12;

    // Validation
    if (principal <= 0 || interestRate <= 0 || numberOfPayments <= 0) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        principalAmount: 0,
        emiSchedule: [],
      };
    }

    // Simple Interest Calculation
    // Total Interest = Principal × Annual Interest Rate × Years
    const totalInt = principal * (interestRate / 100) * loanTenure;
    // Total Payment = Principal + Total Interest
    const totalPaid = principal + totalInt;
    // Monthly Payment = Total Payment ÷ Total Months
    const emi = calculateEMI(principal, interestRate, loanTenure, numberOfPayments);
    // Generate schedule with equal principal and interest
    const schedule = generateEMISchedule(principal, totalInt, numberOfPayments, emi);

    return {
      monthlyPayment: emi,
      totalPayment: totalPaid,
      totalInterest: totalInt,
      principalAmount: principal,
      emiSchedule: schedule,
    };
  }, [loanAmount, downPayment, interestRate, loanTenure]);

  // Extract calculated values
  const { monthlyPayment, totalPayment, totalInterest, principalAmount, emiSchedule } = calculationResults;

  // Memoized derived values
  const downPaymentPercentage = useMemo(
    () => (loanAmount > 0 ? (downPayment / loanAmount) * 100 : 0),
    [downPayment, loanAmount]
  );

  // Calculate dynamic step for down payment slider based on loan amount
  const downPaymentStep = useMemo(() => {
    if (loanAmount < 10000000) {
      return 100000; // 100K step for small amounts (< 10M)
    } else if (loanAmount < 50000000) {
      return 500000; // 500K step for medium amounts (< 50M)
    } else {
      return 5000000; // 5M step for large amounts (>= 50M)
    }
  }, [loanAmount]);

  const interestPercentage = useMemo(
    () => (principalAmount > 0 ? (totalInterest / principalAmount) * 100 : 0),
    [totalInterest, principalAmount]
  );

  const requiredMonthlyIncome = useMemo(
    () => (monthlyPayment > 0 ? monthlyPayment / 0.4 : 0),
    [monthlyPayment]
  );

  // Handle interest rate slider with debouncing for smooth updates
  const handleInterestRateChange = useCallback((value: number[]) => {
    const newValue = value[0];
    setInterestRateDisplay(newValue);
    
    // Clear existing timeout
    if (interestRateTimeoutRef.current) {
      clearTimeout(interestRateTimeoutRef.current);
    }
    
    // Update actual rate after a short delay for smoother slider experience
    interestRateTimeoutRef.current = setTimeout(() => {
      setInterestRate(newValue);
    }, 50);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interestRateTimeoutRef.current) {
        clearTimeout(interestRateTimeoutRef.current);
      }
    };
  }, []);

  // Sync display rate when actual rate changes from input
  useEffect(() => {
    if (interestRateDisplay !== interestRate) {
      setInterestRateDisplay(interestRate);
    }
  }, [interestRate]);

  // Ensure down payment doesn't exceed loan amount
  useEffect(() => {
    if (downPayment > loanAmount) {
      setDownPayment(loanAmount);
    }
  }, [loanAmount, downPayment]);

  // Memoized yearly schedule data
  const yearlyScheduleData = useMemo(() => {
    return Array.from({ length: loanTenure }, (_, yearIndex) => {
      const yearData = emiSchedule.slice(yearIndex * 12, (yearIndex + 1) * 12);
      return {
        year: yearIndex + 1,
        principal: yearData.reduce((sum, month) => sum + month.principal, 0),
        interest: yearData.reduce((sum, month) => sum + month.interest, 0),
        total: yearData.reduce((sum, month) => sum + month.emi, 0),
        balance: yearData.length > 0 ? yearData[yearData.length - 1].balance : 0,
      };
    });
  }, [emiSchedule, loanTenure]);

  return (
    <>
      <SEOHead seo={seo} path="/loan-calculator" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-1 bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent text-center">
              {t('calculators.loanCalculator')}
            </h1>
            <p className="text-muted-foreground mt-2 text-center">
              {t('loanCalculator.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4 border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('loanCalculator.loanDetails')}
                  </CardTitle>
                  <CardDescription>
                    {t('loanCalculator.adjustValues')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Value */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="propertyValue" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        {t('loanCalculator.propertyValue')}
                      </Label>
                      <Badge variant="outline">{formatCurrency(loanAmount)} MMK</Badge>
                    </div>
                    <Slider
                      id="propertyValue"
                      min={1000000}
                      max={2000000000}
                      step={1000000}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="cursor-pointer"
                    />
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="mt-2"
                      min={1000000}
                      max={2000000000}
                    />
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="downPayment" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-primary" />
                        {t('loanCalculator.downPayment')}
                      </Label>
                      <Badge variant="outline">
                        {formatCurrency(downPayment)} MMK ({downPaymentPercentage.toFixed(1)}%)
                      </Badge>
                    </div>
                    <Slider
                      id="downPayment"
                      min={0}
                      max={loanAmount}
                      step={downPaymentStep}
                      value={[downPayment]}
                      onValueChange={(value) => setDownPayment(value[0])}
                      className="cursor-pointer"
                    />
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Math.min(Number(e.target.value), loanAmount))}
                      className="mt-2"
                      min={0}
                      max={loanAmount}
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interestRate" className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        {t('loanCalculator.interestRate')}
                      </Label>
                      <Badge variant="outline">{interestRateDisplay.toFixed(2)}%</Badge>
                    </div>
                    <Slider
                      id="interestRate"
                      min={3}
                      max={20}
                      step={0.25}
                      value={[interestRateDisplay]}
                      onValueChange={handleInterestRateChange}
                      className="cursor-pointer"
                    />
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 3 && value <= 20) {
                          setInterestRate(value);
                          setInterestRateDisplay(value);
                        }
                      }}
                      step="0.1"
                      min={3}
                      max={20}
                      className="mt-2"
                    />
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loanTenure" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {t('loanCalculator.loanTenure')}
                      </Label>
                      <Badge variant="outline">
                        {loanTenure} {t('loanCalculator.years')}
                      </Badge>
                    </div>
                    <Slider
                      id="loanTenure"
                      min={1}
                      max={30}
                      step={1}
                      value={[loanTenure]}
                      onValueChange={(value) => setLoanTenure(value[0])}
                      className="cursor-pointer"
                    />
                    <Select
                      value={loanTenure.toString()}
                      onValueChange={(value) => setLoanTenure(Number(value))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_TENURE_OPTIONS.map((years) => (
                          <SelectItem key={years} value={years.toString()}>
                            {years} {t('loanCalculator.years')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => window.open('/loan-request', '_blank', 'noopener,noreferrer')}
                    className="w-full gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    size="lg"
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    {t('loanCalculator.applyForLoan')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-8 px-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-muted-foreground">
                        {t('loanCalculator.monthlyEMI')}
                      </p>
                      <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-primary mb-1">
                      {formatCurrency(monthlyPayment)} MMK
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {loanTenure * 12} {t('loanCalculator.monthlyPayments')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-200/50">
                  <CardContent className="pt-8 px-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-muted-foreground">
                        {t('loanCalculator.totalPayment')}
                      </p>
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="mb-1">{formatCurrency(totalPayment)} MMK</div>
                    <p className="text-sm text-muted-foreground">
                      {t('loanCalculator.overYears').replace('{years}', String(loanTenure))}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-8 px-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-muted-foreground">
                        {t('loanCalculator.principalAmount')}
                      </p>
                      <Banknote className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mb-1">{formatCurrency(principalAmount)} MMK</div>
                    <p className="text-sm text-muted-foreground">
                      {t('loanCalculator.loanAfterDownPayment')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-8 px-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-muted-foreground">
                        {t('loanCalculator.totalInterest')}
                      </p>
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="mb-1">{formatCurrency(totalInterest)} MMK</div>
                    <p className="text-sm text-muted-foreground">
                      {interestPercentage.toFixed(1)}% {t('loanCalculator.ofPrincipal')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    {t('loanCalculator.paymentBreakdown')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {t('loanCalculator.principal')}
                        </span>
                        <span className="text-sm font-medium">{formatCurrency(principalAmount)} MMK</span>
                      </div>
                      <Progress
                        value={totalPayment > 0 ? (principalAmount / totalPayment) * 100 : 0}
                        className="h-3 bg-muted"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {t('loanCalculator.interest')}
                        </span>
                        <span className="text-sm font-medium">{formatCurrency(totalInterest)} MMK</span>
                      </div>
                      <Progress
                        value={totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0}
                        className="h-3 bg-muted [&>div]:bg-orange-500"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {t('loanCalculator.downPayment')}
                        </span>
                        <span className="text-sm font-medium">{formatCurrency(downPayment)} MMK</span>
                      </div>
                      <Progress
                        value={loanAmount > 0 ? (downPayment / loanAmount) * 100 : 0}
                        className="h-3 bg-muted [&>div]:bg-green-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {t('loanCalculator.totalCostOfProperty')}
                      </span>
                      <span>{formatCurrency(totalPayment + downPayment)} MMK</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Affordability Check */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('loanCalculator.affordabilityCheck')}
                  </CardTitle>
                  <CardDescription>
                    {t('loanCalculator.affordabilityDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {t('loanCalculator.recommendedMonthlyIncome')}
                        </p>
                        <div className="text-primary">
                          {formatCurrency(requiredMonthlyIncome)} MMK
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('loanCalculator.affordabilityMessage').replace('{amount}', formatCurrency(requiredMonthlyIncome))}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* EMI Schedule Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('loanCalculator.emiPaymentSchedule')}
                  </CardTitle>
                  <CardDescription>
                    {t('loanCalculator.emiScheduleDescription').replace('{months}', String(emiSchedule.length))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="yearly">
                    <TabsList className="mb-4">
                      <TabsTrigger value="yearly">
                        {t('loanCalculator.yearlyView')}
                      </TabsTrigger>
                      <TabsTrigger value="monthly">
                        {t('loanCalculator.monthlyView')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="yearly">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">
                                {t('loanCalculator.year')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.principal')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.interest')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.totalPayment')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.balance')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearlyScheduleData.map((yearData) => (
                              <tr key={yearData.year} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">
                                  {yearData.year}
                                </td>
                                <td className="text-right p-3">{formatCurrency(yearData.principal)}</td>
                                <td className="text-right p-3">{formatCurrency(yearData.interest)}</td>
                                <td className="text-right p-3 font-medium">{formatCurrency(yearData.total)}</td>
                                <td className="text-right p-3">{formatCurrency(yearData.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    <TabsContent value="monthly">
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-background">
                            <tr className="border-b">
                              <th className="text-left p-3">
                                {t('loanCalculator.month')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.emi')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.principal')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.interest')}
                              </th>
                              <th className="text-right p-3">
                                {t('loanCalculator.balance')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {emiSchedule.map((month) => (
                              <tr key={month.month} className="border-b hover:bg-muted/50">
                                <td className="p-3">{month.month}</td>
                                <td className="text-right p-3">{formatCurrency(month.emi)}</td>
                                <td className="text-right p-3">{formatCurrency(month.principal)}</td>
                                <td className="text-right p-3">{formatCurrency(month.interest)}</td>
                                <td className="text-right p-3">{formatCurrency(month.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Tips to Save on Your Loan */}
              <Card className="border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-base">
                    💡 {t('loanCalculator.tipsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      • <strong>{t('loanCalculator.tipIncreaseDownPayment')}</strong>{' '}
                      {t('loanCalculator.tipIncreaseDownPaymentDesc')}
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipShorterTenure')}</strong>{' '}
                      {t('loanCalculator.tipShorterTenureDesc')}
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipPrepayments')}</strong>{' '}
                      {t('loanCalculator.tipPrepaymentsDesc')}
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipCompareRates')}</strong>{' '}
                      {t('loanCalculator.tipCompareRatesDesc')}
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipCreditScore')}</strong>{' '}
                      {t('loanCalculator.tipCreditScoreDesc')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Money Saving Tips */}
              <Card className="border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    {t('loanCalculator.moneySavingTipsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      • <strong>{t('loanCalculator.tipExtraPayments')}</strong>
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipShorterTerms')}</strong>
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipShopAround')}</strong>
                    </li>
                    <li>
                      • <strong>{t('loanCalculator.tipImproveCredit')}</strong>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
