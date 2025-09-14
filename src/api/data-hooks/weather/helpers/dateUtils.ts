import { format, parse } from 'date-fns';


export function getLocalHHMM(localtime: string) {
  const date = parse(localtime, 'yyyy-MM-dd HH:mm', new Date());
  return format(date, 'hh:mm a');
}
