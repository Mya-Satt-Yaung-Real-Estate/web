/**
 * Property Details Card Component
 * 
 * Displays property details with tabs for Description, Features, and Comments.
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ThumbsUp,
  MessageCircle,
  Eye,
  CheckCircle,
  Home,
  Sparkles,
  CreditCard,
  Send,
  Edit2,
  Trash2,
  Reply,
  X,
} from 'lucide-react';
import type { PublicPropertyDetail } from '@/types/publicProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';

interface PropertyDetailsCardProps {
  property: PublicPropertyDetail;
  title: string;
  description: string;
  locationString: string;
  listingTypeName: string;
  propertyTypeName: string;
  propertyConditionLabel: string;
  isLiked: boolean;
  onLike: () => void;
  formatTimestamp: (dateString: string) => string;
  isAuthenticated: boolean;
  onAddComment: (comment: string) => void;
  onUpdateComment: (commentId: number, comment: string) => void;
  onDeleteComment: (commentId: number) => void;
  onReplyToComment: (commentId: number, comment: string) => void;
  isAddingComment?: boolean;
  isUpdatingComment?: boolean;
  isDeletingComment?: boolean;
  isReplying?: boolean;
  t: (key: string) => string | undefined;
}

export function PropertyDetailsCard({
  property,
  title,
  description,
  locationString,
  listingTypeName,
  propertyTypeName,
  propertyConditionLabel,
  isLiked,
  onLike,
  formatTimestamp,
  isAuthenticated,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onReplyToComment,
  isAddingComment = false,
  isUpdatingComment = false,
  isDeletingComment = false,
  isReplying = false,
  t,
}: PropertyDetailsCardProps) {
  const { language } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setNewComment('');
  };

  const handleStartEdit = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSaveEdit = (commentId: number) => {
    const trimmed = editCommentText.trim();
    if (!trimmed) return;
    onUpdateComment(commentId, trimmed);
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleStartEditReply = (replyId: number, currentText: string) => {
    setEditingReplyId(replyId);
    setEditReplyText(currentText);
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditReplyText('');
  };

  const handleSaveEditReply = (replyId: number) => {
    const trimmed = editReplyText.trim();
    if (!trimmed) return;
    onUpdateComment(replyId, trimmed);
    setEditingReplyId(null);
    setEditReplyText('');
  };

  const handleStartReply = (commentId: number) => {
    setReplyingToCommentId(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyText('');
  };

  const handleSubmitReply = (commentId: number) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onReplyToComment(commentId, trimmed);
    setReplyingToCommentId(null);
    setReplyText('');
  };
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex-1">
              <h1 className="mb-2 text-lg sm:text-xl lg:text-2xl">{title}</h1>
              {property.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{locationString}</span>
                </div>
              )}
            </div>
            <div className="text-left sm:text-right">
              <div className="text-primary mb-1 text-lg sm:text-xl font-semibold">{formatPriceLakh(property.price || '0', property.price_lakh, language) || '-'}</div>
              <Badge variant="outline" className="text-xs sm:text-sm">{listingTypeName}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bed className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('propertyDetail.bedrooms') || 'Bedrooms'}</p>
              <p>{property.bedrooms || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bath className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('propertyDetail.bathrooms') || 'Bathrooms'}</p>
              <p>{property.bathrooms || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Square className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">{t('propertyDetail.area') || 'Area'}</p>
              <p>{property.area_sqft ? parseFloat(property.area_sqft).toLocaleString() : '0'} sqft</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Property Information */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{t('propertyDetail.propertyType') || 'Property Type'}</p>
            </div>
            <p className="text-sm">{propertyTypeName}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{t('propertyDetail.condition') || 'Condition'}</p>
            </div>
            <p className="text-sm">{propertyConditionLabel}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{t('propertyDetail.bankInstallment') || 'Bank Installment'}</p>
            </div>
            <p className="text-sm">
              {property.bank_installment_available ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t('propertyDetail.available') || 'Available'}
                </span>
              ) : (
                t('propertyDetail.notAvailable') || 'Not Available'
              )}
            </p>
          </div>
        </div>

        <Separator />

        {/* Like & Comments Stats */}
        <div className="flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm">{property.stats?.like_count || 0}</span>
            <span className="hidden sm:inline text-sm">{t('propertyDetail.likes') || 'Likes'}</span>
          </button>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{(property.stats?.view_count || 0).toLocaleString()}</span>
            <span className="hidden sm:inline text-sm">{t('propertyDetail.views') || 'Views'}</span>
          </div>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">
              {(() => {
                // Calculate total comments including replies
                if (!property.comments || !Array.isArray(property.comments)) {
                  return property.stats?.comment_count || 0;
                }
                const totalComments = property.comments.length;
                const totalReplies = property.comments.reduce((sum, comment) => {
                  return sum + (comment.replies?.length || comment.reply_count || 0);
                }, 0);
                return totalComments + totalReplies;
              })()}
            </span>
            <span className="hidden sm:inline text-sm">{t('propertyDetail.comments') || 'Comments'}</span>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" className="text-xs sm:text-sm">{t('propertyDetail.description') || 'Description'}</TabsTrigger>
            <TabsTrigger value="features" className="text-xs sm:text-sm">{t('propertyDetail.features') || 'Features'}</TabsTrigger>
            <TabsTrigger value="comments" className="text-xs sm:text-sm">
              {t('propertyDetail.comments') || 'Comments'} ({(() => {
                // Calculate total comments including replies
                if (!property.comments || !Array.isArray(property.comments)) {
                  return 0;
                }
                const totalComments = property.comments.length;
                const totalReplies = property.comments.reduce((sum, comment) => {
                  return sum + (comment.replies?.length || comment.reply_count || 0);
                }, 0);
                return totalComments + totalReplies;
              })()})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4 pt-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </TabsContent>
          
          <TabsContent value="features" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.features && property.features.length > 0 ? (
                property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">{t('propertyDetail.noFeatures') || 'No features listed'}</p>
              )}
            </div>
          </TabsContent>
          
          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6 pt-4">
            {/* Add Comment Form */}
            <div className="space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('propertyDetail.writeComment') || 'Write a comment...'}
                className="min-h-[100px] resize-none"
                disabled={isAddingComment || !isAuthenticated}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isAddingComment || !isAuthenticated}
                  size="sm"
                >
                  {isAddingComment ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {t('propertyDetail.postComment') || 'Post Comment'}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Comments List */}
            <div className="space-y-6">
              {!property.comments || property.comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t('propertyDetail.noComments') || 'No comments yet. Be the first to comment!'}</p>
                </div>
              ) : (
                property.comments.map(comment => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-[#4a9b82]">
                        {comment.profile_link ? (
                          <ImageWithFallback
                            src={comment.profile_link}
                            alt={comment.user_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="mb-1">{comment.user_name}</p>
                            <p className="text-muted-foreground text-sm">
                              {formatTimestamp(comment.created_at)}
                            </p>
                          </div>
                          {comment.is_me && (
                            <div className="flex gap-2">
                              {editingCommentId === comment.id ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSaveEdit(comment.id)}
                                    disabled={isUpdatingComment}
                                    className="bg-primary/10 text-primary hover:bg-primary/20"
                                  >
                                    {t('propertyDetail.save') || 'Save'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdatingComment}
                                    className="bg-primary/10 text-primary hover:bg-primary/20"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStartEdit(comment.id, comment.comment)}
                                    className="bg-primary/10 text-primary hover:bg-primary/20"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDeleteComment(comment.id)}
                                    disabled={isDeletingComment}
                                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="min-h-[80px] resize-none"
                              disabled={isUpdatingComment}
                            />
                          </div>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-wrap">{comment.comment}</p>
                        )}
                        {isAuthenticated && editingCommentId !== comment.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartReply(comment.id)}
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            {t('propertyDetail.reply') || 'Reply'}
                          </Button>
                        )}

                        {/* Reply Form */}
                        {replyingToCommentId === comment.id && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-border">
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={t('propertyDetail.writeReply') || 'Write a reply...'}
                              className="min-h-[80px] resize-none"
                              disabled={isReplying}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyText.trim() || isReplying}
                              >
                                {isReplying ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                {t('propertyDetail.postReply') || 'Post Reply'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelReply}
                                disabled={isReplying}
                              >
                                {t('propertyDetail.cancel') || 'Cancel'}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="space-y-4 mt-4 pl-4 border-l-2 border-border">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-[#4a9b82]">
                                  {reply.profile_link ? (
                                    <ImageWithFallback
                                      src={reply.profile_link}
                                      alt={reply.user_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                                      {reply.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="mb-1 text-sm">{reply.user_name}</p>
                                      <p className="text-muted-foreground text-sm mb-1">
                                        {formatTimestamp(reply.created_at)}
                                      </p>
                                    </div>
                                    {reply.is_me && (
                                      <div className="flex gap-2">
                                        {editingReplyId === reply.id ? (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleSaveEditReply(reply.id)}
                                              disabled={isUpdatingComment}
                                              className="bg-primary/10 text-primary hover:bg-primary/20"
                                            >
                                              {t('propertyDetail.save') || 'Save'}
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={handleCancelEditReply}
                                              disabled={isUpdatingComment}
                                              className="bg-primary/10 text-primary hover:bg-primary/20"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleStartEditReply(reply.id, reply.comment)}
                                              className="bg-primary/10 text-primary hover:bg-primary/20"
                                            >
                                              <Edit2 className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => onDeleteComment(reply.id)}
                                              disabled={isDeletingComment}
                                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {editingReplyId === reply.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={editReplyText}
                                        onChange={(e) => setEditReplyText(e.target.value)}
                                        className="min-h-[60px] resize-none text-sm"
                                        disabled={isUpdatingComment}
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{reply.comment}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

