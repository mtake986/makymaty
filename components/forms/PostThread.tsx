"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

import { usePathname, useRouter } from "next/navigation";
// import { updateUser } from "@/lib/actions/user.actions";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { TagInput } from "./TagInput";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeFirstLetter } from "@/lib/utils/capitalizeFirstLetter";
import { workoutPartsOptions } from "@/constants";
import { MinusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

type Props = {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
};

type Checked = DropdownMenuCheckboxItemProps["checked"];

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const [topics, setTopics] = useState<string[]>([]);
  const [needAnotherOption, setNeedAnotherOption] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      text: "",
      topics: [""],
      trainingParts: ["Any"],
      anotherTrainingParts: ["chest"],
      gymInfo: {
        name: "BYU - Idaho Fitness Center",
        city: "Rexburg",
        state: "ID",
        country: "United States",
        address: "",
        zipCode: "83460",
      },
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    const payload = {
      text: values.text,
      topics: values.topics?.filter((topic) => topic !== ""),
      trainingParts: values.trainingParts,
      anotherTrainingParts: needAnotherOption
        ? values.anotherTrainingParts
        : [],
      gymInfo: values.gymInfo,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    };
    await createThread(payload);

    router.push("/");
  };

  const { setValue } = form;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10">
        <div className="flex flex-col gap-5">
          <p className="text-heading4-medium text-light-4">Workout Info.</p>
          <div className="flex flex-col items-start gap-3">
            {/* {workoutPartsOptions.map((option, i) => ( */}
            <FormField
              // key={i}
              control={form.control}
              name="trainingParts"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start sm:gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-3 space-y-0">
                    <FormLabel className="text-base-semibold text-light-2">
                      Training Parts
                    </FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="no-focus border border-dark-4 bg-dark-3 text-light-1 hover:bg-dark-3 hover:text-light-1">
                            Select
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 border border-dark-4 bg-dark-3 text-light-1">
                          {workoutPartsOptions.map((option, i) => (
                            <DropdownMenuCheckboxItem
                              className="focus:bg-dark-4 focus:text-light-1"
                              key={i}
                              checked={field.value.includes(option.value)}
                              onCheckedChange={(checked) => {
                                console.log(checked, field.value, option.value);
                                if (checked) {
                                  if (field.value[0] === "Any") {
                                    setValue("trainingParts", [option.value]);
                                  } else {
                                    setValue("trainingParts", [
                                      option.value,
                                      ...field.value,
                                    ]);
                                  }
                                } else {
                                  if (field.value.length === 1) {
                                    setNeedAnotherOption(false);
                                    setValue("trainingParts", ["Any"]);
                                  } else {
                                    setValue(
                                      "trainingParts",
                                      field.value.filter(
                                        (ele) => ele !== option.value
                                      )
                                    );
                                  }
                                }
                              }}>
                              {option.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                  </div>
                  <FormDescription className="!mt-1 sm:!mt-0">
                    {field.value.map((option) => (
                      <span
                        className="text-base-regular mr-2 text-light-3"
                        key={option}>
                        {capitalizeFirstLetter(option)}
                      </span>
                    ))}
                  </FormDescription>
                  <FormDescription className="!mt-1 sm:!mt-0">
                    {field.value.includes("Any") ? null : !needAnotherOption ? (
                      <span
                        onClick={() => setNeedAnotherOption(true)}
                        className="cursor-pointer hover:underline text-base-regular mr-2 text-light-3">
                        Another Option?
                      </span>
                    ) : null}
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* ))} */}
            {needAnotherOption && (
              <FormField
                // key={i}
                control={form.control}
                name="anotherTrainingParts"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start sm:gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-3 space-y-0">
                      <FormLabel className="text-base-semibold text-light-2">
                        Another Training Parts
                      </FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="no-focus border border-dark-4 bg-dark-3 text-light-1 hover:bg-dark-3 hover:text-light-1">
                              Select
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-40 border border-dark-4 bg-dark-3 text-light-1">
                            {workoutPartsOptions.map((option, i) => (
                              <DropdownMenuCheckboxItem
                                className="focus:bg-dark-4 focus:text-light-1"
                                key={i}
                                checked={field.value.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  console.log(
                                    checked,
                                    field.value,
                                    option.value
                                  );
                                  if (checked) {
                                    setValue("anotherTrainingParts", [
                                      option.value,
                                      ...field.value,
                                    ]);
                                  } else {
                                    if (field.value.length === 1) {
                                      setValue("anotherTrainingParts", [
                                        option.value,
                                      ]);
                                      toast("Need to select at least one.");
                                    } else {
                                      setValue(
                                        "anotherTrainingParts",
                                        field.value.filter(
                                          (ele) => ele !== option.value
                                        )
                                      );
                                    }
                                  }
                                }}>
                                {option.label}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </div>
                    <FormDescription className="!mt-0">
                      {field.value.map((option) => (
                        <span
                          className="text-base-regular mr-2 text-light-3"
                          key={option}>
                          {capitalizeFirstLetter(option)}
                        </span>
                      ))}
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Description
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <p className="text-heading4-medium text-light-4">Gym Info.</p>
          <FormField
            control={form.control}
            name="gymInfo.name"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  Name
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gymInfo.city"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  City
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gymInfo.state"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  State
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gymInfo.country"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  Country
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gymInfo.address"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  Address
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gymInfo.zipCode"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel className="text-base-semibold min-w-20 text-light-2">
                  Zip Code
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Topics
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <TagInput
                  {...field}
                  topics={topics}
                  className="sm:min-w-[450px] bg-dark-3"
                  setTopics={(newTopics) => {
                    setTopics(newTopics);
                    setValue("topics", newTopics as [string, ...string[]]);
                  }}
                />
              </FormControl>
              <FormDescription className="text-stone-700">
                Press Enter or type a comma to add a topic.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
