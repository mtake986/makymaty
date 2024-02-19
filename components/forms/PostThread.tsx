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
      thread: "",
      topics: [""],
      trainingParts: ["Any"],
      anotherTrainingParts: ["chest"],
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      topics: values.topics,
      trainingParts: values.trainingParts,
      anotherTrainingParts: values.anotherTrainingParts,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  const { setValue } = form;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex gap-3 items-start">
          {/* {workoutPartsOptions.map((option, i) => ( */}
          <FormField
            // key={i}
            control={form.control}
            name="trainingParts"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormLabel className="text-base-semibold text-light-2">
                  Training Parts
                </FormLabel>
                <FormControl>
                  {/* <Checkbox
                      checked={field.value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        console.log(checked, field.value, option.value);
                        if (checked) {
                          setValue("trainingParts", [
                            option.value,
                            ...field.value,
                          ]);
                        } else {
                          setValue(
                            "trainingParts",
                            field.value.filter((ele) => ele !== option.value)
                          );
                        }
                      }}
                      className="border-white"
                    /> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="no-focus border border-dark-4 bg-dark-3 text-light-1 hover:bg-dark-3 hover:text-light-1">
                        {field.value
                          .map((part: string) => capitalizeFirstLetter(part))
                          .sort()
                          .join(" & ")}
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
                {field.value.includes("Any") ? null : !needAnotherOption ? (
                  <FormDescription
                    onClick={() => setNeedAnotherOption(true)}
                    className="cursor-pointer hover:underline">
                    Another Option?
                  </FormDescription>
                ) : (
                  <FormDescription>or</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            // key={i}
            control={form.control}
            name="anotherTrainingParts"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0">
                {needAnotherOption &&
                  !form.getValues("trainingParts").includes("Any") && (
                    <>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="no-focus border border-dark-4 bg-dark-3 text-light-1 hover:bg-dark-3 hover:text-light-1">
                              {field.value
                                .map((part: string) =>
                                  capitalizeFirstLetter(part)
                                )
                                .sort()
                                .join(" & ")}
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
                                      setValue("anotherTrainingParts", [option.value]);
                                      toast("Need to select at least one to hit.");
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
                      <FormDescription className="cursor-pointer ">
                        <MinusCircleIcon
                          onClick={() => setNeedAnotherOption((prev) => !prev)}
                          size={16}
                          className="text-red-500"
                        />
                      </FormDescription>
                    </>
                  )}
              </FormItem>
            )}
          />
          {/* ))} */}
        </div>

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
