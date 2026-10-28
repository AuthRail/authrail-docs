import {
  BookOpenIcon,
  BooksIcon,
  ChartBarIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  CodeIcon,
  CubeIcon,
  FileTextIcon,
  FingerprintIcon,
  GearIcon,
  GitBranchIcon,
  InfoIcon,
  KeyIcon,
  ListChecksIcon,
  NetworkIcon,
  PlugsConnectedIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  StackIcon,
  TerminalIcon,
} from '@phosphor-icons/react/dist/ssr';
import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { createElement } from 'react';

const icons = {
  BookOpenIcon,
  BooksIcon,
  ChartBarIcon,
  SquaresFourIcon,
  ClipboardTextIcon,
  CodeIcon,
  CubeIcon,
  FileTextIcon,
  FingerprintIcon,
  GitBranchIcon,
  ClockCounterClockwiseIcon,
  InfoIcon,
  KeyIcon,
  StackIcon,
  ListChecksIcon,
  NetworkIcon,
  PlugsConnectedIcon,
  GearIcon,
  ShieldCheckIcon,
  TerminalIcon,
};
const docs = defineDocs({ dir: 'content/docs' });
export const source = loader({
  baseUrl: '/docs', source: docs.toFumadocsSource(),
  icon(name) {
    const Icon = name && name in icons ? icons[name as keyof typeof icons] : undefined;
    return Icon ? createElement(Icon, { size: 16, 'aria-hidden': true }) : undefined;
  },
});
