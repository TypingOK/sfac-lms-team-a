"use client";

import useGetLectureInfo from "@/hooks/reactQuery/lecture/useGetLectureInfo";
import React, { useEffect, useState } from "react";
import { LectureInfo } from "./CreateLecture";
import { Timestamp } from "firebase/firestore";
import LectureButton from "./LectureButton";
import LectureLink from "./LectureLink";
import LectureNote from "./LectureNote";
import LecturePrivate from "./LecturePrivate";
import LectureTimestamp from "./LectureTimestamp";
import LectureTitle from "./LectureTitle";
import LectureVideo from "./LectureVideo";
import ModalWrapper from "@/components/ModalWrapper";
import arrow from "/public/images/arrow.svg";
import Image from "next/image";
import useUpdateLecture from "@/hooks/reactQuery/lecture/useUpdateLecture";
import LoadingSpinner from "@/components/Loading/Loading";

interface Props {
  lectureId: string;
}

export default function UpdateLecture({ lectureId }: Props) {
  const [isUpdateModalOpened, setIsUpdateModalOpened] = useState(false);
  const { data } = useGetLectureInfo(lectureId);
  const [lecture, setLecture] = useState<LectureInfo>({
    title: "",
    isPrivate: false,
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    order: 0,
    lectureType: "노트",
    lectureContent: {
      images: [],
      textContent: "",
      externalLink: "",
      video: [],
      videoUrl: "",
      videoLength: "",
    },
  });

  useEffect(() => {
    if (data) {
      setLecture({
        title: data.title,
        isPrivate: data.isPrivate,
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: data.createdAt,
        updatedAt: Timestamp.now(),
        order: data.order,
        lectureType: data.lectureType,
        lectureContent: data.lectureContent,
      });
    }
  }, [data]);

  const pageByMethod: { [key: string]: JSX.Element } = {
    노트: (
      <LectureNote
        note={lecture.lectureContent?.textContent}
        setLecture={setLecture}
      ></LectureNote>
    ),
    비디오: (
      <LectureVideo
        video={lecture.lectureContent?.video}
        setLecture={setLecture}
      ></LectureVideo>
    ),
    링크: (
      <LectureLink
        link={lecture.lectureContent?.externalLink}
        setLecture={setLecture}
      ></LectureLink>
    ),
  };

  const modalHandler = () => {
    setIsUpdateModalOpened(prev => !prev);
  };

  const { mutate, isLoading } = useUpdateLecture(modalHandler);

  const onSubmitBtnClick = () => {
    mutate({ lecture, lectureId });
  };

  return (
    <>
      {isUpdateModalOpened && (
        <ModalWrapper
          modalTitle={
            <div className="flex gap-2.5">
              강의 수정하기
              {<Image src={arrow} alt="화살표" width="7" height="10" />}{" "}
              수정하기
            </div>
          }
          onCloseModal={modalHandler}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <LectureTitle title={lecture.title} setLecture={setLecture} />
              {pageByMethod[lecture.lectureType]}
              <div className="flex mt-[24px] justify-between">
                <LectureTimestamp
                  startDate={lecture.startDate}
                  endDate={lecture.endDate}
                  setLecture={setLecture}
                />
                <LecturePrivate
                  isPrivate={lecture.isPrivate}
                  setLecture={setLecture}
                />
                <LectureButton
                  onClick={onSubmitBtnClick}
                  disabled={
                    !(
                      lecture.lectureContent.video.length ||
                      lecture.lectureContent.externalLink ||
                      lecture.lectureContent.textContent
                    )
                  }
                >
                  업로드
                </LectureButton>
              </div>
            </>
          )}
        </ModalWrapper>
      )}
      <button
        className="w-[115px] h-[35px] bg-primary-80 text-white rounded-[10px] size-[14px] font-bold leading-4"
        onClick={modalHandler}
      >
        수정
      </button>
    </>
  );
}
