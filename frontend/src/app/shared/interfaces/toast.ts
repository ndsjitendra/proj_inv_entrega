export interface ToastMessage {
  message: string;
  position: 'top' | 'bottom' | 'middle';
  color: string;
  duration:number
}