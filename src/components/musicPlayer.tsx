'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '@/components/provider/songProvider';
import Image from 'next/image';
import { CiCirclePlus } from "react-icons/ci";
import {
    FaCirclePlay,
    FaCirclePause,
    FaForward,
    FaBackward,
    FaRepeat
} from "react-icons/fa6";
import { BsFilePlayFill } from "react-icons/bs";
import {
    PiMicrophoneStageFill,
    PiSpeakerHighFill,
    PiSpeakerXFill,
    PiSpeakerLowFill
} from "react-icons/pi";
import {
    MdLyrics,
    MdCastConnected
} from "react-icons/md";
import {
    RiExpandDiagonalLine
} from "react-icons/ri";

import { TbSwitch3 } from "react-icons/tb";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const MusicPlayer: React.FC = () => {
    const { currentSong } = useAppContext()

    const [isPlaying, setIsPlaying] = useState(false);
    const [endTime, setEndTime] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const [sound, setSound] = useState(100);
    const [isMute, setIsMute] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        {
            audioRef.current = new Audio(currentSong?.audio);
            const audioElement = audioRef.current;

            audioElement.addEventListener('loadedmetadata', () => {
                setEndTime(audioElement.duration);
            });

            audioElement.addEventListener('timeupdate', () => {
                setStartTime(audioElement.currentTime);
            });

            audioElement.addEventListener('ended', () => {
                setIsPlaying(false);
            });

            audioElement.volume = sound / 100;
            audioElement.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.error('Autoplay failed:', error);
                });
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('loadedmetadata', () => { });
                audioRef.current.removeEventListener('timeupdate', () => { });
            }
        };
    }, [currentSong]);


    useEffect(() => {
        const progress = (startTime / endTime) * 100;
        setProgressWidth(progress);
    }, [startTime, endTime]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleClickOnProgress = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressPercent = (clickX / rect.width) * 100;
        const newTime = (progressPercent / 100) * endTime;
        if (audioRef.current) {
            const audioElement = audioRef.current;
            audioElement.currentTime = newTime;
            setStartTime(audioElement.currentTime);
        }
    };
    const handleClickSound = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressPercent = Math.floor((clickX / rect.width) * 100);
        setSound(progressPercent);
        if (audioRef.current) {
            audioRef.current.volume = progressPercent / 100;
        }
    }

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSkipForward = () => {
        if (audioRef.current) {
            const audioElement = audioRef.current;
            audioElement.currentTime += 5;
            setStartTime(audioElement.currentTime);
        }
    };

    const handleSkipBackward = () => {
        if (audioRef.current) {
            const audioElement = audioRef.current;
            audioElement.currentTime -= 5;
            setStartTime(audioElement.currentTime);
        }
    };

    const handleRepeat = () => {
        setIsRepeat(!isRepeat);
        if (audioRef.current) {
            audioRef.current.loop = !audioRef.current.loop;
        }
    };

    const handleMuteSound = () => {
        if (audioRef.current) {
            if (isMute) {
                audioRef.current.volume = 20 / 100;
                setSound(20)
            } else {
                audioRef.current.volume = 0 / 100;
                setSound(0)
            }
            setIsMute(!isMute)
        }
    }

    const getVolumeIcon = () => {
        if (sound === 0) {
            return <PiSpeakerXFill className='w-[18px] h-[18px]' onClick={handleMuteSound} />;
        } else if (sound < 50 && sound > 0) {
            return <PiSpeakerLowFill className='w-[18px] h-[18px]' onClick={handleMuteSound} />;
        } else {
            return <PiSpeakerHighFill className='w-[18px] h-[18px]' onClick={handleMuteSound} />;
        }
    };

    if (!currentSong) return null;

    return (
        <TooltipProvider>
            <div className='fixed bottom-0 h-[12vh] w-full border-2 bg-[#121212] flex justify-between items-center px-5' >
                <div className='flex items-center'>
                    <Image
                        src={currentSong.poster}
                        alt="Song Poster"
                        width={60}
                        height={60}
                        className='mb-2 rounded-md'
                    />
                    <div className='ml-3'>
                        <p className='font-[400]'>{currentSong.name}</p>
                        <p className='text-[0.8rem] text-primaryColorGray font-thin'>{currentSong.artist}</p>
                    </div>
                    <div className='ml-3 cursor-pointer text-primaryColorGray transition-transform duration-200 hover:scale-105 hover:text-white'>
                        <CiCirclePlus className='w-[20px] h-[20px]' />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='flex items-center mb-1'>
                        <Tooltip>
                            <TooltipTrigger>
                                <TbSwitch3 className='mx-3 w-[24px] h-[24px] cursor-pointer text-primaryColorGray hover:text-primaryColorPink' />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Bật phát lộn xộn</p>
                            </TooltipContent>
                        </Tooltip>
                        <FaBackward
                            className='mx-3 w-[20px] h-[20px] cursor-pointer text-primaryColorGray hover:text-primaryColorPink'
                            onClick={handleSkipBackward}
                        />
                        {isPlaying ? (
                            <FaCirclePause
                                className='mx-3 w-[32px] h-[32px] cursor-pointer'
                                onClick={handlePlayPause}
                            />
                        ) : (
                            <FaCirclePlay
                                className='mx-3 w-[32px] h-[32px] cursor-pointer'
                                onClick={handlePlayPause}
                            />
                        )}
                        <FaForward
                            className='mx-3 w-[20px] h-[20px] cursor-pointer text-primaryColorGray hover:text-primaryColorPink'
                            onClick={handleSkipForward}
                        />
                        <Tooltip>
                            <TooltipTrigger className='relative'>
                                <FaRepeat
                                    className={`mx-3 w-[20px] h-[20px] cursor-pointer text-primaryColorGray hover:text-primaryColorPink ${isRepeat ? 'text-primaryColorPink' : 'text-white'}`}
                                    onClick={handleRepeat}
                                />
                                {
                                    isRepeat &&
                                    (
                                        <div className='absolute left-2 -bottom-2 mx-3 w-[5px] h-[5px] bg-primaryColorPink rounded-full'>

                                        </div>
                                    )
                                }
                            </TooltipTrigger>
                            <TooltipContent>
                                {isRepeat ? 'Tắt chế độ lặp lại' : 'Bật chế độ lặp lại một bài'}
                            </TooltipContent>
                        </Tooltip>

                    </div>
                    <div className='flex items-center'>
                        <p className='mx-2 text-[0.9rem]'>{formatTime(startTime)}</p>
                        <div className='relative group hover:cursor-pointer' onClick={handleClickOnProgress}>
                            <div className='w-[35vw] bg-[#4D4D4D] h-1 rounded-md '></div>
                            <div
                                className='absolute bg-white top-0 w-full h-1 rounded-md'
                                style={{ width: `${progressWidth}%` }}
                            ></div>
                            <div
                                className='absolute -top-[100%] left-[50%] w-3 h-3 bg-white rounded-full transform -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                                style={{ left: `calc(${progressWidth}%)` }}  // Adjust the position of the circle
                            ></div>
                        </div>
                        <p className='mx-2 text-[0.9rem]'>{formatTime(endTime)}</p>
                    </div>
                </div>
                <div className='flex'>
                    <BsFilePlayFill className='w-[18px] h-[18px] ml-2 cursor-pointer' />
                    <PiMicrophoneStageFill className='w-[18px] h-[18px] ml-2 cursor-pointer' />
                    <MdLyrics className='w-[18px] h-[18px] ml-2 cursor-pointer' />
                    <MdCastConnected className='w-[18px] h-[18px] ml-2 cursor-pointer' />
                    <div className='flex items-center ml-2 cursor-pointer'>
                        {getVolumeIcon()}

                        <div className='relative ml-1'
                            onClick={handleClickSound}
                            title={`${sound}`}
                        >
                            <div className='w-[7vw] bg-[#4D4D4D] h-1 rounded-md'></div>
                            <div
                                className='absolute bg-white top-0 w-full h-1 rounded-md'
                                style={{ width: `${sound}%` }}
                            ></div>
                        </div>
                    </div>

                    <RiExpandDiagonalLine className='w-[18px] h-[18px] ml-2 cursor-pointer' />
                </div>
            </div>
        </TooltipProvider>
    )
}

export default MusicPlayer