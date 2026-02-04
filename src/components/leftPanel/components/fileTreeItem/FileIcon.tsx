import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiReact,
  SiJson,
  SiMarkdown,
  SiSass,
  SiVite,
} from 'react-icons/si';
import { VscFileCode, VscFileMedia } from 'react-icons/vsc';
import { getFileIconData } from '../../../../types';

const IconMap: Record<string, React.ElementType> = {
  ts: SiTypescript,
  react: SiReact,
  js: SiJavascript,
  html: SiHtml5,
  css: SiCss3,
  sass: SiSass,
  json: SiJson,
  md: SiMarkdown,
  vite: SiVite,
  image: VscFileMedia,
  default: VscFileCode,
};

interface Props {
  fileName: string;
}

export const FileIcon = ({ fileName }: Props) => {
  const iconData = getFileIconData(fileName);
  const IconComponent = IconMap[iconData.type] || IconMap.default;

  return (
    <span className="file-icon" style={{ color: iconData.color }}>
      <IconComponent />
    </span>
  );
};
