'use client';

import * as z from 'zod';
import { House, Room } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface AddHouseFormProps {
    house: House | null;
}

export type HouseWithRoom = House & {
    rooms: Room[];
};

const formSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    image: z.string().min(1, { message: 'Image is required' }),
    county: z.string().min(1, { message: 'County is required' }),
    city: z.string().optional(),
    locationDescription: z.string().min(10, { message: 'Location description must be at least 10 characters long' }),
    gym: z.boolean().optional(),
    spar: z.boolean().optional(),
    bar: z.boolean().optional(),
    parking: z.boolean().optional(),
    swimmingpool: z.boolean().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddHouseForm = ({ house }: AddHouseFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            image: "",
            county: "",
            city: "",
            locationDescription: "",
            gym: false,
            spar: false,
            bar: false,
            parking: false,
            swimmingpool: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>House Title</FormLabel>
                                <FormDescription>
                                    Provide your house Apartment name.
                                </FormDescription>
                                <FormControl>
                                    <Input placeholder="View of house" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                </form>
            </Form>
        </div>
    );
};

export default AddHouseForm;