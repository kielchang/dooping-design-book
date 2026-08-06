// 全站 MDX 元件：文件頁不必逐頁 import 就能直接寫活範例。
// 這些是**真的元件庫元件**（webpack alias 指到 packages/react/src），不是複製品。
import MDXComponents from "@theme-original/MDXComponents";
import { Demo, Rules, Do, Dont } from "@site/src/components/Demo";
import { StoryFrame } from "@site/src/components/StoryFrame";
import {
  FlowThreeWays, FlowAdoptionStages, FlowStayingCurrent, FlowPageFirstSteps,
} from "@site/src/components/flow-diagrams";
import {
  Button, Badge, Callout, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Label, Checkbox, NumberInput,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Tooltip, TruncatedText,
  SegGroup, Chips,
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, NumCell, NumHead,
  DataTable, TabPills, Delta, EmptyState, Stepper,
  Placeholder, Spotlight, MockScreenFrame, MockRow,
  EditableField, ChangeSummary,
  BarChart, Pareto, StackedBar, TrendChart, Bullet, Scatter, Heatmap, LineChart, Legend,
} from "@dooping/react";

export default {
  ...MDXComponents,
  Demo, Rules, Do, Dont, StoryFrame,
  FlowThreeWays, FlowAdoptionStages, FlowStayingCurrent, FlowPageFirstSteps,
  Button, Badge, Callout, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Label, Checkbox, NumberInput,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Tooltip, TruncatedText,
  SegGroup, Chips,
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, NumCell, NumHead,
  DataTable, TabPills, Delta, EmptyState, Stepper,
  Placeholder, Spotlight, MockScreenFrame, MockRow,
  EditableField, ChangeSummary,
  BarChart, Pareto, StackedBar, TrendChart, Bullet, Scatter, Heatmap, LineChart, Legend,
};
