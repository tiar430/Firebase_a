import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="m172.42 89.28-56 32a12 12 0 0 0-6.23 10.39V168a12 12 0 0 0 24 0v-29.43l45.74-26.13a12 12 0 0 0-7.51-22.16ZM118 113.83l45.74-26.14a12 12 0 1 0-7.51-22.16l-56 32A12 12 0 0 0 94 108v48a12 12 0 0 0 24 0Z" />
      </g>
    </svg>
  );
}
