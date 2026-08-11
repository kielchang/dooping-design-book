import { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Coachmark } from "./coachmark";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const meta: Meta<typeof Coachmark> = { title: "Components/Guidance/Coachmark", id: "元件/引導/聚光導引-coachmark" };
export default meta;
type Story = StoryObj;

const STEPS = [
  { title: "Choose a unit", body: <>Choose an existing unit or create a new one.</> },
  { title: "Add items", body: <>Add several items at once; quantity and amount can be adjusted later.</>, actionHint: "👆 Try the highlighted button above" },
  { title: "Final review", body: <>Review the <strong>change summary</strong> before submitting.</> },
];

/**
 * 導引本身的狀態機（走到第幾步、錨點在哪）屬於**宿主應用**，不在元件庫裡。
 * 這個 story 演示的就是「宿主要寫的那一小段」。
 */
export const 三步導引: Story = {
  name: "Three-step tour",
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const refs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];

    useLayoutEffect(() => {
      if (!open) return;
      const el = refs[step]?.current;
      setRect(el ? el.getBoundingClientRect() : null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, step]);

    return (
      <div className="space-y-4">
        <Button onClick={() => { setStep(0); setOpen(true); }}>Start tour</Button>
        <Card className="max-w-xl">
          <CardHeader><CardTitle>Create a record</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button ref={refs[0]} variant="outline">Choose unit</Button>
            <Button ref={refs[1]} variant="outline">Add items</Button>
            <Button ref={refs[2]}>Review and submit</Button>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          聚光洞可以點穿——導引是教人操作，不是代替他操作。卡片右上角可以縮小，
          騰出空間做真正的操作後再展開。
        </p>
        {open && (
          <Coachmark
            targetRect={rect}
            title={STEPS[step].title}
            body={STEPS[step].body}
            actionHint={STEPS[step].actionHint}
            stepIndex={step}
            stepCount={STEPS.length}
            isFirst={step === 0}
            isLast={step === STEPS.length - 1}
            onNext={() => (step === STEPS.length - 1 ? setOpen(false) : setStep((s) => s + 1))}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
            onSkip={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};

export const 驗收模式: Story = {
  name: "Acceptance mode",
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [verdict, setVerdict] = useState<"pass" | "issue" | null>(null);
    const [note, setNote] = useState("");
    const anchor = useRef<HTMLButtonElement>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);
    useLayoutEffect(() => { if (open) setRect(anchor.current?.getBoundingClientRect() ?? null); }, [open]);
    return (
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Start acceptance</Button>
        <Card className="max-w-md">
          <CardHeader><CardTitle>Record list</CardTitle></CardHeader>
          <CardContent><Button ref={anchor} variant="outline">Export CSV</Button></CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          同一個元件換一種用途：逐步標記「通過／有問題」＋備註，走完就是一份可交付的驗收報告。
        </p>
        {open && (
          <Coachmark
            targetRect={rect}
            title="Acceptance: export"
            body={<>Select “Export CSV” and confirm the download matches the <strong>filtered</strong> records on screen.</>}
            warning={<>This is demo data; do not use the result as production acceptance evidence.</>}
            stepIndex={0}
            stepCount={1}
            isFirst
            isLast
            showVerdict
            verdict={verdict}
            onVerdict={setVerdict}
            note={note}
            onNote={setNote}
            onNext={() => setOpen(false)}
            onPrev={() => {}}
            onSkip={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};
