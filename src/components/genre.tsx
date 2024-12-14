import { SewingPinIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GenreData } from "@/types/interfaces";
import { PlusIcon, Pencil2Icon , CheckIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import { fetchApiData } from "@/app/api/appService";
import { useAppContext } from "@/app/AppProvider";

const Genre: React.FC<GenreData> = ({ genreList: initialGenreList }) => {
  const [genreList, setGenreList] = useState(initialGenreList || []);
  const [isAdding, setIsAdding] = useState(false);
  const [genreName, setGenreName] = useState("");
  const { accessToken } = useAppContext()


  const handleAddGenre = async () => {
    if (!genreName.trim()) {
      toast({
        title: "Error",
        description: "Genre name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetchApiData(
        "/api/admin/create/genre",
        "POST",
        JSON.stringify({ name: genreName }),
        accessToken
      );

      if (response.success) {
        toast({
          title: "Success",
          description: `Genre "${genreName}" has been added successfully.`,
          variant: "success",
        });

        setGenreList((prev) => [
          ...prev,
          { genreId: response.data.genreId, name: genreName },
        ]);
        setGenreName(""); 
        setIsAdding(false);
      } else if (response.error === "Genre exists") {
        toast({
          title: "Duplicate Genre",
          description: "This genre already exists. Please try another name.",
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || "Unknown error occurred.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add genre. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to add genre:", error);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="text-textMedium py-3 px-3 bg-primaryColorPink flex items-center rounded-md shadow-sm shadow-white/60 hover:bg-darkPinkHover">
            <SewingPinIcon className="text-white w-5 h-5" />
            Manage Genres
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex gap-1 items-center text-h1 text-primaryColorPink">
              <SewingPinIcon className="w-5 h-5 text-primaryColorPink" />
              Manage Genres
            </SheetTitle>
            <SheetDescription>
              Make changes and view list to your genre here.
            </SheetDescription>
          </SheetHeader>
          <hr className="my-4" />
          <div className="mt-3 flex flex-col gap-3">
            <h3 className="">List Genres</h3>
            <div className="flex justify-between px-2">
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="text-textMedium py-2 px-3 bg-primaryColorPink flex items-center gap-2 rounded-md shadow-sm shadow-white/60 hover:bg-darkPinkHover"
              >
                <PlusIcon className="text-white w-4 h-4" />
                Add Genre
              </button>
              <button className="text-textMedium py-2 px-3 bg-primaryColorPink flex items-center gap-2 rounded-md shadow-sm shadow-white/60 hover:bg-darkPinkHover">
                <Pencil2Icon className="text-white w-4 h-4" />
                Edit Genre
              </button>
            </div>

            {/* Add Genre */}
            {isAdding && (
              <div className="flex items-center gap-2 px-2 py-2">
                <Input
                  placeholder="Enter new genre"
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  className="flex-1 border-darkerBlue"
                />
                <Button onClick={handleAddGenre} className="shrink-0 p-2">
                  <CheckIcon className="w-5 h-5 text-primaryColorPinkHover" />
                </Button>
              </div>
            )}

            {/* List Genres */}
            <div className="max-h-[60vh] mt-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-darkBlue scrollbar-track-black">
              {genreList && genreList.length > 0 ? (
                genreList.map((genre) => (
                  <div
                    key={genre.genreId}
                    className="mb-2 p-2 border border-primaryColorBlueHover rounded-md shadow-sm"
                  >
                    <p className="capitalize">{genre.name}</p>
                  </div>
                ))
              ) : (
                <p>No genres available.</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Genre;
