"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Copy } from 'lucide-react';
import { useState } from 'react';
import { formatAddress } from '@/lib/utils/index';

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
          Connected
        </Badge>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={connector?.icon} alt={connector?.name} />
            <AvatarFallback>
              <Wallet className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              {ensName || formatAddress(address)}
            </p>
            <p className="text-xs text-muted-foreground">
              {connector?.name}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="hidden sm:flex"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="sm:hidden p-2"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to start using Pippu Lending Protocol
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              onClick={() => {
                connect({ connector });
                setIsOpen(false);
              }}
              disabled={isPending || connector.ready === false}
              className="justify-start h-auto p-4"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={connector.icon} alt={connector.name} />
                  <AvatarFallback>
                    <Wallet className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{connector.name}</p>
                  {connector.ready === false && (
                    <p className="text-sm text-muted-foreground">
                      Not available
                    </p>
                  )}
                </div>
              </div>
            </Button>
          ))}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}