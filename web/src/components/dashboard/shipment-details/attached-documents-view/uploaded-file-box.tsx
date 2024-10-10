import React from "react";

import FileTypeDetector from "src/components/common/file-uploader/file-type-detector";
import { AccountTypeEnum } from "src/interfaces/global";
import { useUserInfo } from "src/lib/hooks/useUserInfo";

interface UploadedFileBoxProps {
  fileType?: string;
  description: string;
  url: string;
  fileExtension: string;
  isLocal?: boolean;
  id: string;
  allowOnlyDownload?: boolean;
  seen?: boolean;
  milestoneId?: string;
}

const UploadedFileBox: React.FC<UploadedFileBoxProps> = ({
  fileType,
  description,
  url,
  id,
  fileExtension,
  milestoneId,
  allowOnlyDownload = false,
  isLocal = false,
  seen = true,
}) => {
  const { accountType } = useUserInfo();
  const isBuyer = accountType === AccountTypeEnum.BUYER;
  return (
    <div className="group relative max-h-[200px] w-full  max-w-[150px] rounded-[4px] border border-tm-black-20">
      {isBuyer && !seen ? (
        <p className="absolute left-[5px] top-[5px] z-[9] rounded-[4px] border border-tm-black-80 bg-[#D5D8DD] px-[4px] py-[1px] text-[13px]   text-tm-black-80 shadow-lg">
          new
        </p>
      ) : null}
      <FileTypeDetector
        allowOnlyDownload={allowOnlyDownload}
        fileType={fileType}
        url={url}
        description={description}
        fileExtension={fileExtension}
        milestoneId={milestoneId}
        seen={seen}
        id={id}
      />
      <div className="relative -top-[3px] max-h-[80px] min-h-[80px] w-full max-w-[150px] rounded-[4px] bg-tm-white p-[10px] shadow-inner">
        <p className="clamp-4  text-[14px] font-normal leading-[1.2em] text-tm-black-80">{description}</p>
      </div>
    </div>
  );
};

export default UploadedFileBox;
