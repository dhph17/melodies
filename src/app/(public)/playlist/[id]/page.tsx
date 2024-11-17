'use client'
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/AppProvider";
import PlaylistBanner from "@/components/playlistBanner"
import { IoSearch } from "react-icons/io5";
import { IoPlayCircleOutline } from "react-icons/io5";
import { TfiMoreAlt } from "react-icons/tfi";
import Image, { StaticImageData } from "next/image";
import { fetchApiData } from "@/app/api/appService";
import LoadingPage from "@/components/loadingPage";
import { DataPlaylist, DataSong } from "@/types/interfaces";
import Playlist from '@/assets/img/placeholderPlaylist.png'
import { formatTime, getMainArtistName, getPoster, getPosterSong } from "@/utils/utils";
import { RiPlayListAddLine } from "react-icons/ri";
import { MdEdit, MdDelete } from "react-icons/md";
import UpdatePlaylist from "@/components/popup/updatePlaylist";
import ConfirmDeletePlaylist from "@/components/popup/confirmDeletePlaylist";

const Page = ({ params }: { params: { id: string } }) => {
    const { accessToken, loading, setLoading } = useAppContext()
    const [playlist, setPlaylist] = useState<DataPlaylist>()
    const [showMenuMore, setShowMenuMore] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [dominantColor, setDominantColor] = useState<string>();
    const [filteredSongs, setFilteredSongs] = useState<DataSong[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const result = await fetchApiData(`/api/user/playlist/detail/${params.id}`, "GET", null, accessToken);
            if (result.success) {
                setPlaylist(result.data.playlist)
                const imageUrl = result.data.playlist.image;
                if (imageUrl) {
                    try {
                        const response = await fetch(
                            `/api/get-dominant-color?imageUrl=${encodeURIComponent(imageUrl as string)}`
                        );
                        console.log("API response:", response);
                        const data = await response.json();
                        if (response.ok) {
                            console.log("Dominant color:", data.dominantColor);
                            setDominantColor(data.dominantColor);
                        } else {
                            console.error("Error fetching dominant color:", data.error);
                        }
                    } catch (error) {
                        console.error("Error fetching dominant color:", error);
                    }
                } else {
                    setDominantColor('#595959');
                }

            } else {
                console.error("Login error:", result.error);
                // setNotFound(true)
            }
            setLoading(false);
        };
        fetchData();
    }, [params.id]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (searchTerm === "") {
                setFilteredSongs([]);
            } else {
                const results = await fetchApiData(`/api/songs/search`, "GET", null, null, { query: searchTerm, page: 1 });
                if (results.success) {
                    setFilteredSongs(results.data.songs)
                }
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    if (loading) return <LoadingPage />
    return (
        <div className="w-full  bg-secondColorBg">
            <div
                className="m-3 rounded-lg border-2 border-primaryColorBg bg-gradient-to-b to bg-primaryColorBg overflow-auto"
                style={{
                    background: `linear-gradient(to bottom, ${dominantColor} 20%, rgba(0, 0, 0, 1) 80%)`,
                }}
            >
                <PlaylistBanner data={playlist} setIsUpdate={setIsUpdate} />
                <div className="m-3 flex flex-col pl-5">
                    <div className="flex gap-5 items-center relative">
                        <IoPlayCircleOutline className="mt-1 w-16 h-16 text-primaryColorPink" />
                        <button className=" text-primaryColorPink" onClick={() => setShowMenuMore(!showMenuMore)}>
                            <TfiMoreAlt className="w-5 h-5 shadow-[0_4px_60px_rgba(0,0,0,0.3)]" />
                        </button>
                        {
                            showMenuMore && (
                                <div className="absolute top-14 left-20 bg-[#1F1F1F]">
                                    <ul className="">
                                        <li
                                            className="flex gap-3 px-3 py-2 items-center cursor-pointer hover:bg-slate-500 transition-all duration-300"

                                        ><RiPlayListAddLine /> Add to waiting list</li>
                                        <li
                                            className="flex gap-3 px-3 py-2 items-center cursor-pointer hover:bg-slate-500 transition-all duration-300"
                                            onClick={() => { setIsUpdate(true); setShowMenuMore(false) }}
                                        ><MdEdit /> Edit detail playlist</li>
                                        <li
                                            className="flex gap-3 px-3 py-2 items-center cursor-pointer hover:bg-slate-500 transition-all duration-300"
                                            onClick={() => { setIsDelete(true); setShowMenuMore(false) }}
                                        ><MdDelete /> Delete playlist</li>
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                    {/* <table className="max-w-full text-white border-separate border-spacing-y-3 ">
                        <thead className="w-full max-h-[32px]">
                            <tr className="text-primaryColorGray text-[0.9rem]">
                                <th className="w-[4%] pl-4 text-start">#</th>
                                <th className="w-[4%] pl-4"></th>
                                <th className="w-[70%] pl-4 text-start">Tiêu đề</th>
                                <th className="w-[10%] text-textMedium ">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playlist?.songsOfPlaylist.map((song, index) => (
                                <tr
                                    key={index}
                                    className="bg-secondColorBg cursor-pointer hover:bg-gray-700"
                                >
                                    <td className="pl-4 pr-8 text-h4 rounded-tl-lg rounded-bl-lg">
                                        #{index + 1}
                                    </td>
                                    <td className="py-1">
                                        <Image
                                            src={getPoster(dataAlbum)}
                                            alt="song"
                                            width={50}
                                            height={50}
                                            className="rounded-lg"
                                        />
                                    </td>
                                    <td className="pl-4">
                                        <h3 className="text-h4 mb-1 hover:underline">
                                            {song.title}
                                        </h3>
                                        <p className="text-textSmall hover:underline">
                                            {getMainArtistName(song.artists)}
                                        </p>
                                    </td>
                                    <td className="text-center pl-4 rounded-tr-lg rounded-br-lg align-middle">
                                        <div className="flex gap-3 items-center justify-center">
                                            <p className="text-textMedium">{formatTime(song.duration)}</p>
                                            <button className="hover:scale-110">
                                                <IoIosMore className="w-5 h-5 shadow-[0_4px_60px_rgba(0,0,0,0.3)]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                    <div className="w-full h-[0.125rem] bg-gray-500 my-5">

                    </div>
                    <div>
                        <p className="font-bold text-2xl mb-3">Let&apos;s find content for your playlist</p>
                        <div className="flex items-center bg-[#2C2C2C] w-[35%] p-2 gap-2 rounded-md">
                            <IoSearch className="text-[1.2rem]" />
                            <input type="text" placeholder="Find songs"
                                className="focus:outline-none placeholder:text-[0.9rem] placeholder:text-primaryColorGray text-primaryColorGray text-[0.9rem] bg-transparent w-full"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <table className="max-w-full text-white border-separate border-spacing-y-3 ">
                        <thead className="w-full max-h-[32px]">
                            <tr>
                                <th className="w-[35%] pl-4"></th>
                                <th className="w-[40%] pl-4"></th>
                                <th className="w-[15%] pl-4"></th>
                            </tr>
                        </thead>
                        <tbody className="mt-4">
                            {filteredSongs.length > 0 && (
                                filteredSongs.map((song, index) => (
                                    <tr key={index}>
                                        <td className="relative group flex" >
                                            <Image
                                                src={getPosterSong(song.album).image}
                                                alt="Song Poster"
                                                width={48}
                                                height={48}
                                                quality={100}
                                                className="object-cover rounded-md"
                                            />
                                            <div className="ml-3">
                                                <p className="font-bold text-white">{song.item.title}</p>
                                                <p className="font-thin text-primaryColorGray text-[0.9rem]">
                                                    {getMainArtistName(song.item.artists)}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="font-thin text-primaryColorGray text-[0.9rem]">
                                                {getPosterSong(song.item.album).title}
                                            </p>
                                        </td>
                                        <td>
                                            <button className="px-4 py-1 border-white border-2 text-[0.8rem] text-white font-bold rounded-full hover:text-black hover:bg-white transition-all duration-300">Add</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isUpdate && (
                    <UpdatePlaylist onClose={() => setIsUpdate(false)}
                        setPlaylist={setPlaylist}
                        data={playlist} />
                )
            }
            {
                isDelete && (
                    <ConfirmDeletePlaylist onClose={() => setIsDelete(false)}
                        data={playlist}
                    />
                )
            }
        </div >

    )
}

export default Page