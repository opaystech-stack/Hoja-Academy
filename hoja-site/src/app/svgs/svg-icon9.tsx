export default function Icon9({ dittoId }: { dittoId?: string }) {
  return (
    <svg className="w-6 h-6 hidden mr-2.5 overflow-hidden align-bottom [animation-name:indicator-spin] [animation-duration:1.3s] [animation-timing-function:cubic-bezier(0.46,_0.35,_0.39,_0.85)] [animation-iteration-count:infinite]" viewBox="0 0 512 512" fill="currentColor" data-ditto-id={dittoId}>
      <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
    </svg>
  );
}
