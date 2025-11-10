
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateCommunityForm } from './create-community-form';

export const CreateCommunityModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
          <DialogDescription>
            Create your own community to share and connect with others.
          </DialogDescription>
        </DialogHeader>
        <CreateCommunityForm />
      </DialogContent>
    </Dialog>
  );
};
