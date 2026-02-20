export interface Component {
  cleanup?: () => void;
}

export interface GameModeButtonComponent extends Component, HTMLButtonElement {}
