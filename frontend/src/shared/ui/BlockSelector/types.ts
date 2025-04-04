import { ReactNode } from 'react';

export interface BlockSelectorProps {
	blocks: ReactNode[];
	selected: number | null;
	onSelect: (index: number | null) => void;
}
