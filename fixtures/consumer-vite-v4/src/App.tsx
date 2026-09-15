import { useState } from "react";
import { Badge } from "@/components/dooping/badge";
import { Button } from "@/components/dooping/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dooping/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/dooping/dialog";
import { Input } from "@/components/dooping/input";
import { Label } from "@/components/dooping/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dooping/select";

// 一頁中性示範。每個 data-probe 都是 scripts/verify-consumer.mjs 會量的點：
// card＝--card、primary＝--primary、color-mix＝透明度修飾、Dialog 面板＝--background、Select 清單＝--popover。
export function App() {
  const [unit, setUnit] = useState("甲");
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">取用端驗收頁</h1>
      <Card data-probe="card">
        <CardHeader>
          <CardTitle>批次紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge>待確認</Badge>
          <div className="space-y-2">
            <Label htmlFor="batch">批次編號</Label>
            <Input id="batch" defaultValue="B-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">單位</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit" data-probe="select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="甲">單位甲</SelectItem>
                <SelectItem value="乙">單位乙</SelectItem>
                <SelectItem value="丙">單位丙</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div data-probe="color-mix" className="h-4 rounded bg-primary/50" />
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button data-probe="primary">開啟對話框</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>確認項目</DialogTitle>
          <DialogDescription>這是驗收用的對話框。</DialogDescription>
        </DialogContent>
      </Dialog>
    </main>
  );
}
