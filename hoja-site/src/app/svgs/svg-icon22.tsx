export default function Icon22({ dittoId }: { dittoId?: string }) {
  return (
    <svg className="box-content w-9 h-9 block absolute top-3 left-3 overflow-hidden [overflow-wrap:break-word] pointer-events-none" data-component="icon" aria-hidden="true" fill="currentColor" data-ditto-id={dittoId}>
      <use xlinkHref="#chat-icon-bubble" />
    </svg>
  );
}
