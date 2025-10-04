import { useState } from "react";
import { ArrowLeft, User, Smartphone, Mail, Lock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User as UserType } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [editField, setEditField] = useState<"name" | "mobile" | "email" | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      return apiRequest("PUT", "/api/user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setEditField(null);
      setEditValue("");
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (field: "name" | "mobile" | "email") => {
    if (!user) return;
    setEditField(field);
    setEditValue(user[field]);
  };

  const handleSave = () => {
    if (!editField || !editValue.trim()) return;
    updateUserMutation.mutate({ [editField]: editValue });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <div className="h-8 w-32 bg-muted animate-pulse rounded-md mb-6" />
          </div>
        </div>
        <div className="px-4">
          <div className="max-w-mobile mx-auto">
            <div className="flex flex-col items-center mb-8">
              <div className="h-24 w-24 bg-muted animate-pulse rounded-full mb-4" />
              <div className="h-6 w-48 bg-muted animate-pulse rounded-md mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/more">
              <button data-testid="button-back" className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md">
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            </Link>
            <h1 className="text-xl font-bold">Profile Settings</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-mobile mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarFallback className="bg-purple-500 text-white text-3xl font-semibold">
                  {user?.name.split(" ").map(n => n[0]).join("").toUpperCase() || "AG"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-chart-2 rounded-full flex items-center justify-center border-2 border-background">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">Joined 2 years ago</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Full name</p>
                  <p className="text-base font-semibold" data-testid="text-full-name">{user?.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-edit-name"
                  className="text-primary"
                  onClick={() => handleEdit("name")}
                >
                  Edit
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Mobile</p>
                  <p className="text-base font-semibold" data-testid="text-mobile">{user?.mobile}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-edit-mobile"
                  className="text-primary"
                  onClick={() => handleEdit("mobile")}
                >
                  Edit
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-card-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-base font-semibold" data-testid="text-email">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-edit-email"
                  className="text-primary"
                  onClick={() => handleEdit("email")}
                >
                  Edit
                </Button>
              </div>
            </div>

            <button
              data-testid="button-change-password"
              onClick={() => console.log("Change password clicked")}
              className="w-full bg-card rounded-xl p-4 border border-card-border hover-elevate active-elevate-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-red-600" />
                </div>
                <span className="flex-1 text-left text-base font-semibold">Change password</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editField} onOpenChange={() => setEditField(null)}>
        <DialogContent className="max-w-mobile">
          <DialogHeader>
            <DialogTitle>
              Edit {editField === "name" ? "Name" : editField === "mobile" ? "Mobile" : "Email"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type={editField === "email" ? "email" : editField === "mobile" ? "tel" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={`Enter your ${editField}`}
              data-testid={`input-edit-${editField}`}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditField(null)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={updateUserMutation.isPending || !editValue.trim()}
                data-testid="button-save-edit"
              >
                {updateUserMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
