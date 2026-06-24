type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
};

export default function BrandLogo({
  className = "",
  imageClassName = "h-9 w-auto",
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/linkaro-logo.png"
        alt="Linkora"
        width={400}
        height={341}
        className={`block object-contain ${imageClassName}`}
      />
    </span>
  );
}
