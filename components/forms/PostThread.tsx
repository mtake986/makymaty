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

const workoutPartsOptions = [
  { value: "chest", label: "Chest" },
  { value: "arms", label: "Arms" },
  { value: "legs", label: "Legs" },
  // Add more options as needed
];

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

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const [topics, setTopics] = useState<string[]>([]);
  const [trainingParts, setTrainingParts] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      topics: [""],
      trainingParts: [""],
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      topics: values.topics,
      trainingParts: values.trainingParts,
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
                  placeholder="Enter a topic"
                  topics={topics}
                  className="sm:min-w-[450px] bg-dark-3"
                  setTopics={(newTopics) => {
                    setTopics(newTopics);
                    setValue("topics", newTopics as [string, ...string[]]);
                  }}
                />
              </FormControl>
              <FormDescription className="text-stone-700">
                These are the topics that you&apos;re interested in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-7 items-center">
          {workoutPartsOptions.map((option, i) => (
            <FormField
              key={i}
              control={form.control}
              name="trainingParts"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl className="">
                    <Checkbox
                      checked={field.value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        // setValue(
                        //   "trainingParts",
                        //   newPart as [string, ...string[]]
                        // );
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
                    />
                  </FormControl>
                  <FormLabel className="text-light-1 mt-0">
                    {option.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
