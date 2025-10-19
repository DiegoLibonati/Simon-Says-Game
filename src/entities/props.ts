interface DefaultProps {
  className?: string;
  children?: string;
}

export interface GameModeButtonProps extends DefaultProps {
  id: string;
  ariaLabel: string;
  onClick: (e: MouseEvent) => void;
}
