import React, { useState, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext, Link } from 'react-router-dom';
import { Loader2, BellRing, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const NotificationItem = ({ notification, onMarkRead }) => {
  return (
    <div className={cn("flex items-start gap-4 p-4 border-b", !notification.is_read && "bg-primary/5")}>
      <div className="mt-1">
        <BellRing className={cn("h-5 w-5", !notification.is_read ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{timeAgo(notification.created_at)}</p>
          <div className="flex items-center gap-2">
            {notification.link && (
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link to={notification.link}>View</Link>
              </Button>
            )}
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPanel({ activeOrgId }) {
  const { toast } = useToast();
  
  const fetchNotifications = async () => {
    if (!activeOrgId) return [];
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('organization_id', activeOrgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data: notifications, isLoading, refetch } = useQuery(fetchNotifications, [activeOrgId]);
  
  const unreadNotifications = useMemo(() => notifications?.filter(n => !n.is_read) || [], [notifications]);
  const readNotifications = useMemo(() => notifications?.filter(n => n.is_read) || [], [notifications]);

  const handleMarkAsRead = async (id) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: "Could not mark notification as read." });
    } else {
      refetch();
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = unreadNotifications.map(n => n.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: "Could not mark all notifications as read." });
    } else {
      toast({ title: "All notifications marked as read." });
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Notifications</CardTitle>
        {unreadNotifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
            </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="unread" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[400px]">
                <TabsContent value="unread">
                    {unreadNotifications.length > 0 ? (
                        unreadNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} onMarkRead={handleMarkAsRead} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <p>You're all caught up!</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="read">
                    {readNotifications.length > 0 ? (
                         readNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <p>No read notifications yet.</p>
                        </div>
                    )}
                </TabsContent>
            </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}