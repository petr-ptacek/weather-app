export type Props = {
  day: Date | null;
  days: Date[];
  onDaySelected: (day: Date) => void;
}


export type UseControllerOptions = {
  props: Props;
};